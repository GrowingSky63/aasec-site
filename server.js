require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');
const Busboy = require('busboy');
const msal = require('@azure/msal-node');

const ROOT = __dirname;
const PORT = 8080;

// ── Microsoft Entra ID (MSAL) ───────────────────────────────────────────
const msalClient = new msal.ConfidentialClientApplication({
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  }
});
const AUTH_SCOPES = ['openid', 'profile', 'email', 'User.Read'];

// ── Sessões (in-memory + cookie httpOnly) ───────────────────────────────
const sessions = new Map();
const SESSION_COOKIE = 'aasec_sid';
const SESSION_MAX_AGE = 8 * 60 * 60 * 1000; // 8 horas

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const cookies = {};
  header.split(';').forEach(c => {
    const idx = c.indexOf('=');
    if (idx > 0) {
      cookies[c.substring(0, idx).trim()] = c.substring(idx + 1).trim();
    }
  });
  return cookies;
}

function getSession(req) {
  const sid = parseCookies(req)[SESSION_COOKIE];
  if (!sid) return null;
  const session = sessions.get(sid);
  if (!session) return null;
  if (Date.now() - session.criado > SESSION_MAX_AGE) {
    sessions.delete(sid);
    return null;
  }
  return session;
}

function createSession(res, userData, isHttps) {
  const sid = crypto.randomUUID();
  sessions.set(sid, { ...userData, criado: Date.now() });
  const maxAge = SESSION_MAX_AGE / 1000;
  const flags = `HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${isHttps ? '; Secure' : ''}`;
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${sid}; ${flags}`);
}

function destroySession(req, res) {
  const sid = parseCookies(req)[SESSION_COOKIE];
  if (sid) sessions.delete(sid);
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
}

setInterval(() => {
  const now = Date.now();
  for (const [sid, s] of sessions) {
    if (now - s.criado > SESSION_MAX_AGE) sessions.delete(sid);
  }
}, 60 * 60 * 1000);

// ── Helpers ─────────────────────────────────────────────────────────────
function getBaseUrl(req) {
  const host = req.headers.host;
  const protocol = host.includes('localhost') || host.startsWith('127.') || host.startsWith('192.168') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

function getMime(ext) {
  const m = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.pdf': 'application/pdf',
    '.json': 'application/json', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.svg': 'image/svg+xml', '.ico': 'image/x-icon'
  };
  return m[ext] || 'application/octet-stream';
}

function requireAuth(req, res) {
  const session = getSession(req);
  if (!session) {
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, erro: 'Não autenticado' }));
    } else {
      res.writeHead(302, { Location: '/gestao/login.html' });
      res.end();
    }
    return null;
  }
  return session;
}

// ── Servidor ────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const baseUrl = getBaseUrl(req);
  const isHttps = baseUrl.startsWith('https');
  const redirectUri = `${baseUrl}/auth/callback`;

  // ── Auth: login ─────────────────────────────────────────────────────
  if (req.method === 'GET' && pathname === '/auth/login') {
    try {
      const authUrl = await msalClient.getAuthCodeUrl({
        scopes: AUTH_SCOPES,
        redirectUri,
      });
      res.writeHead(302, { Location: authUrl });
      res.end();
    } catch (e) {
      console.error('AUTH login erro:', e.message);
      res.writeHead(302, { Location: '/gestao/login.html?erro=auth' });
      res.end();
    }
    return;
  }

  // ── Auth: callback da Microsoft ─────────────────────────────────────
  if (req.method === 'GET' && pathname === '/auth/callback') {
    const code = parsed.query.code;
    const error = parsed.query.error;
    if (error || !code) {
      console.error('AUTH callback erro:', parsed.query.error_description || 'sem código');
      res.writeHead(302, { Location: '/gestao/login.html?erro=auth' });
      res.end();
      return;
    }
    try {
      const result = await msalClient.acquireTokenByCode({
        code,
        scopes: AUTH_SCOPES,
        redirectUri,
      });
      createSession(res, {
        nome: result.account.name,
        email: result.account.username,
      }, isHttps);
      console.log('AUTH login OK:', result.account.username);
      res.writeHead(302, { Location: '/gestao/convenios.html' });
      res.end();
    } catch (e) {
      console.error('AUTH callback erro:', e.message);
      res.writeHead(302, { Location: '/gestao/login.html?erro=auth' });
      res.end();
    }
    return;
  }

  // ── Auth: informações do usuário logado ─────────────────────────────
  if (req.method === 'GET' && pathname === '/auth/me') {
    const session = getSession(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (session) {
      res.end(JSON.stringify({ logado: true, nome: session.nome, email: session.email }));
    } else {
      res.end(JSON.stringify({ logado: false }));
    }
    return;
  }

  // ── Auth: logout ────────────────────────────────────────────────────
  if (req.method === 'GET' && pathname === '/auth/logout') {
    destroySession(req, res);
    const postLogout = encodeURIComponent(`${baseUrl}/gestao/login.html`);
    const logoutUrl = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${postLogout}`;
    res.writeHead(302, { Location: logoutUrl });
    res.end();
    return;
  }

  // ── Proteger páginas da gestão (HTML) ───────────────────────────────
  if (pathname.startsWith('/gestao/') && pathname.endsWith('.html') && pathname !== '/gestao/login.html') {
    if (!requireAuth(req, res)) return;
  }

  // ── Proteger rotas de API / upload / apagar ─────────────────────────
  if (pathname.startsWith('/api/') && req.method === 'POST') {
    if (!requireAuth(req, res)) return;
  }
  if (req.method === 'POST' && (pathname === '/upload' || pathname === '/apagar')) {
    if (!requireAuth(req, res)) return;
  }

  // ── API extras ──────────────────────────────────────────────────────
  const EXTRAS_PATH = path.join(ROOT, 'docs_extras.json');

  if (req.method === 'GET' && pathname === '/api/extras') {
    let data = '[]';
    try { data = fs.readFileSync(EXTRAS_PATH, 'utf8'); } catch (e) {}
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
    return;
  }

  if (req.method === 'POST' && pathname === '/api/extras') {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      try {
        const body = Buffer.concat(chunks).toString();
        JSON.parse(body);
        fs.writeFileSync(EXTRAS_PATH, body, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400); res.end(JSON.stringify({ ok: false, erro: e.message }));
      }
    });
    return;
  }

  // ── API convênios ───────────────────────────────────────────────────
  const CONVENIOS_PATH = path.join(ROOT, 'dados_convenios.json');

  if (req.method === 'GET' && pathname === '/api/convenios') {
    let data = '[]';
    try { data = fs.readFileSync(CONVENIOS_PATH, 'utf8'); } catch (e) {}
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
    return;
  }

  if (req.method === 'POST' && pathname === '/api/convenios') {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      try {
        const body = Buffer.concat(chunks).toString();
        console.log('CONVENIOS POST tamanho:', body.length);
        JSON.parse(body);
        fs.writeFileSync(CONVENIOS_PATH, body, 'utf8');
        console.log('CONVENIOS salvo OK');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        console.error('CONVENIOS ERRO:', e.message);
        res.writeHead(400); res.end(JSON.stringify({ ok: false, erro: e.message }));
      }
    });
    return;
  }

  // ── Upload de arquivo ───────────────────────────────────────────────
  if (req.method === 'POST' && pathname === '/upload') {
    console.log('UPLOAD recebido, content-type:', req.headers['content-type']);
    const meta = {};
    let fileBuffer = null, fileName = '';
    const fileChunks = [];

    let bb;
    try {
      bb = Busboy({ headers: req.headers });
    } catch (e) {
      res.writeHead(400); res.end(JSON.stringify({ ok: false, erro: 'Content-type inválido: ' + e.message })); return;
    }

    bb.on('field', (name, val) => { meta[name] = val; });
    bb.on('file', (name, stream, info) => {
      fileName = info.filename;
      console.log('UPLOAD arquivo recebido:', fileName);
      stream.on('data', chunk => fileChunks.push(chunk));
      stream.on('end', () => { fileBuffer = Buffer.concat(fileChunks); console.log('UPLOAD tamanho:', fileBuffer.length); });
    });
    bb.on('close', () => {
      try {
        if (!fileBuffer || !fileName) {
          res.writeHead(400); res.end(JSON.stringify({ ok: false, erro: 'Arquivo não recebido' })); return;
        }
        let destDir;
        if (meta.convenio_slug) {
          const subpasta = meta.tipo === 'prestacao' ? 'prestacoes' : meta.tipo === 'foto' ? 'fotos' : 'documentos';
          destDir = path.join(ROOT, 'docs', 'convenios', meta.convenio_slug, subpasta);
        } else {
          const tipoPasta = meta.tipo === 'prestacao' ? 'prestacoes' : meta.tipo;
          destDir = path.join(ROOT, 'docs', tipoPasta, meta.unidade);
        }
        let destName = fileName;
        if (meta.tipo === 'prestacao' && meta.mes && meta.ano) {
          destName = meta.mes + meta.ano + (path.extname(fileName) || '.pdf');
        }
        fs.mkdirSync(destDir, { recursive: true });
        const destPath = path.join(destDir, destName);
        fs.writeFileSync(destPath, fileBuffer);
        const link = '/docs/' + path.relative(path.join(ROOT, 'docs'), destPath).replace(/\\/g, '/');
        console.log('UPLOAD salvo em:', destPath);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, link, nome: destName }));
      } catch (e) {
        console.error('UPLOAD erro:', e.message);
        res.writeHead(500); res.end(JSON.stringify({ ok: false, erro: e.message }));
      }
    });
    bb.on('error', e => {
      console.error('BUSBOY erro:', e.message);
      res.writeHead(500); res.end(JSON.stringify({ ok: false, erro: e.message }));
    });
    req.pipe(bb);
    return;
  }

  // ── Apagar arquivo ──────────────────────────────────────────────────
  if (req.method === 'POST' && pathname === '/apagar') {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString());
        const link = (body.link || '').replace(/^['"]|['"]$/g, '').trim();
        console.log('APAGAR link recebido:', link);
        const rel = link.startsWith('/') ? link.slice(1) : link;
        const filePath = path.join(ROOT, rel);
        if (!filePath.startsWith(path.join(ROOT, 'docs'))) {
          res.writeHead(403); res.end(JSON.stringify({ ok: false, erro: 'Acesso negado' })); return;
        }
        if (fs.existsSync(filePath)) {
          const lixeira = path.join(ROOT, '_lixeira');
          fs.mkdirSync(lixeira, { recursive: true });
          const ts = new Date().toISOString().replace(/[:.]/g, '-');
          const destLixeira = path.join(lixeira, ts + '_' + path.basename(filePath));
          fs.renameSync(filePath, destLixeira);
          console.log('LIXEIRA:', filePath, '->', destLixeira);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, lixeira: destLixeira }));
        } else {
          res.writeHead(404); res.end(JSON.stringify({ ok: false, erro: 'Arquivo não encontrado' }));
        }
      } catch (e) {
        res.writeHead(500); res.end(JSON.stringify({ ok: false, erro: e.message }));
      }
    });
    return;
  }

  // ── Servir arquivos estáticos ───────────────────────────────────────
  const pathDecoded = decodeURIComponent(pathname);
  let filePath = path.join(ROOT, pathDecoded === '/' ? 'index.html' : pathDecoded);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end('Acesso negado'); return; }

  // Bloquear acesso a diretórios sensíveis
  const BLOCKED = ['.git', '.env', 'node_modules', '_lixeira', 'docs_backup'];
  const segments = pathDecoded.replace(/^\//, '').split('/');
  if (segments.some(s => BLOCKED.includes(s))) { res.writeHead(404); res.end('Não encontrado'); return; }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT' || err.code === 'EISDIR') { res.writeHead(404); res.end('Não encontrado'); }
      else { console.error('ERRO ao ler arquivo:', filePath, err.code, err.message); res.writeHead(500); res.end('Erro interno'); }
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': getMime(ext) });
    res.end(data);
  });
});

// ── Backup automático ao iniciar ────────────────────────────────────────
const BACKUP_RETENCAO_DIAS = 7;

function fazerBackup() {
  const docsDir = path.join(ROOT, 'docs');
  const backupRoot = path.join(ROOT, 'docs_backup');
  const hoje = new Date().toISOString().slice(0, 10);
  const backupDir = path.join(backupRoot, hoje);

  if (!fs.existsSync(docsDir)) return;

  if (!fs.existsSync(backupDir)) {
    function copiarDir(src, dest) {
      fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach(item => {
        const s = path.join(src, item);
        const d = path.join(dest, item);
        if (fs.statSync(s).isDirectory()) copiarDir(s, d);
        else fs.copyFileSync(s, d);
      });
    }
    copiarDir(docsDir, backupDir);
    console.log('Backup criado em:', backupDir);
  } else {
    console.log('Backup de hoje já existe:', backupDir);
  }

  if (!fs.existsSync(backupRoot)) return;
  const limite = new Date();
  limite.setDate(limite.getDate() - BACKUP_RETENCAO_DIAS);
  const limiteStr = limite.toISOString().slice(0, 10);

  let removidos = 0;
  fs.readdirSync(backupRoot).forEach(pasta => {
    if (pasta < limiteStr) {
      const p = path.join(backupRoot, pasta);
      fs.rmSync(p, { recursive: true, force: true });
      removidos++;
    }
  });
  if (removidos > 0) console.log('Backups removidos (>' + BACKUP_RETENCAO_DIAS + ' dias):', removidos);
}
fazerBackup();

server.listen(PORT, () => {
  console.log(`\nAASEC servidor rodando em http://localhost:${PORT}`);
  console.log(`Auth Microsoft Entra ID ativo`);
  console.log(`Ctrl+C para parar\n`);
});
