const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const Busboy = require('busboy');

const ROOT = __dirname;
const PORT = 8080;

// Parse multipart form-data simples
function parseMultipart(body, boundary) {
  const parts = [];
  const sep = Buffer.from('--' + boundary);
  let start = body.indexOf(sep) + sep.length + 2;
  while (start < body.length) {
    const end = body.indexOf(sep, start);
    if (end === -1) break;
    const part = body.slice(start, end - 2);
    const headerEnd = part.indexOf('\r\n\r\n');
    if (headerEnd === -1) { start = end + sep.length + 2; continue; }
    const headers = part.slice(0, headerEnd).toString();
    const data = part.slice(headerEnd + 4);
    const nameMatch = headers.match(/name="([^"]+)"/);
    const filenameMatch = headers.match(/filename="([^"]+)"/);
    parts.push({
      name: nameMatch ? nameMatch[1] : '',
      filename: filenameMatch ? filenameMatch[1] : null,
      data
    });
    start = end + sep.length + 2;
  }
  return parts;
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

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // Upload de arquivo — usando busboy
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
        // Destino
        let destDir;
        if (meta.tipo === 'prestacao' && meta.unidade === 'CEI Betel' && meta.ano) {
          destDir = path.join(ROOT, 'docs', 'prestacoes', 'betel', meta.ano);
        } else if (meta.tipo === 'prestacao' && meta.unidade === 'Esco-Lar' && meta.ano) {
          destDir = path.join(ROOT, 'docs', 'prestacoes', 'escoLar', meta.ano);
        } else {
          destDir = path.join(ROOT, 'docs', 'institucional');
        }
        // Nome padronizado
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

  // Apagar arquivo
  if (req.method === 'POST' && pathname === '/apagar') {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString());
        const link = (body.link || '').replace(/^['"]|['"]$/g, '').trim();
        console.log('APAGAR link recebido:', link);
        // link vem como /docs/prestacoes/betel/2026/042026.pdf
        const rel = link.startsWith('/') ? link.slice(1) : link;
        const filePath = path.join(ROOT, rel);
        // Segurança: só apagar dentro de /docs/
        if (!filePath.startsWith(path.join(ROOT, 'docs'))) {
          res.writeHead(403); res.end(JSON.stringify({ ok: false, erro: 'Acesso negado' })); return;
        }
        if (fs.existsSync(filePath)) {
          // Mover para lixeira em vez de apagar
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

  // Servir arquivos estáticos
  const pathDecoded = decodeURIComponent(pathname);
  let filePath = path.join(ROOT, pathDecoded === '/' ? 'index.html' : pathDecoded);
  // Segurança: não sair da pasta raiz
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end('Acesso negado'); return; }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Tentar index.html em subpastas
      if (err.code === 'ENOENT') { res.writeHead(404); res.end('Não encontrado'); }
      else { res.writeHead(500); res.end('Erro interno'); }
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': getMime(ext) });
    res.end(data);
  });
});

// ── Backup automático ao iniciar ─────────────────────────────────────────
const BACKUP_RETENCAO_DIAS = 30;

function fazerBackup() {
  const docsDir = path.join(ROOT, 'docs');
  const backupRoot = path.join(ROOT, 'docs_backup');
  const hoje = new Date().toISOString().slice(0, 10);
  const backupDir = path.join(backupRoot, hoje);

  if (!fs.existsSync(docsDir)) return;

  // Criar backup de hoje se ainda não existir
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
    console.log('✅ Backup criado em:', backupDir);
  } else {
    console.log('Backup de hoje já existe:', backupDir);
  }

  // Limpar backups mais antigos que BACKUP_RETENCAO_DIAS
  if (!fs.existsSync(backupRoot)) return;
  const limite = new Date();
  limite.setDate(limite.getDate() - BACKUP_RETENCAO_DIAS);
  const limiteStr = limite.toISOString().slice(0, 10);

  let removidos = 0;
  fs.readdirSync(backupRoot).forEach(pasta => {
    if (pasta < limiteStr) { // compara string YYYY-MM-DD — funciona cronologicamente
      const p = path.join(backupRoot, pasta);
      fs.rmSync(p, { recursive: true, force: true });
      removidos++;
    }
  });
  if (removidos > 0) console.log('🗑️ Backups removidos (>' + BACKUP_RETENCAO_DIAS + ' dias):', removidos);
}
fazerBackup();

server.listen(PORT, () => {
  console.log(`\n✅ AASEC servidor rodando em http://192.168.1.70:${PORT}`);
  console.log(`   Uploads aceitos em POST /upload`);
  console.log(`   Ctrl+C para parar\n`);
});
