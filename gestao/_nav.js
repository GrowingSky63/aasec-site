/**
 * Navegação e autenticação compartilhada
 */

function initNav(paginaAtiva) {
  const sessao = JSON.parse(sessionStorage.getItem('aasec_sessao') || 'null');
  if (!sessao) { window.location.href = 'login.html'; return; }

  // Preencher info da sessão
  const el = document.getElementById('sb-unidade');
  if (el) el.textContent = sessao.unidade || sessao.nome;

  // Marcar item ativo
  document.querySelectorAll('.nav-item[data-page]').forEach(a => {
    a.classList.toggle('ativo', a.dataset.page === paginaAtiva);
  });

  // Mobile toggle
  const toggle = document.getElementById('mobToggle');
  const sidebar = document.querySelector('.sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.querySelector('.main')?.addEventListener('click', () => {
      if (window.innerWidth < 900) sidebar.classList.remove('open');
    });
  }
}

function sair() {
  sessionStorage.removeItem('aasec_sessao');
  window.location.href = 'login.html';
}

function getSessao() {
  return JSON.parse(sessionStorage.getItem('aasec_sessao') || 'null');
}

// Fecha modal ao clicar fora
function initModal(id) {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', e => { if (e.target === el) fecharModal(id); });
}

function abrirModal(id) {
  document.getElementById(id)?.classList.add('on');
}

function fecharModal(id) {
  document.getElementById(id)?.classList.remove('on');
}

// Confirmação simples
function confirmar(msg) {
  return confirm(msg || 'Tem certeza?');
}

// Formatar data ISO
function fmtData(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR');
}

// Cor por valor percentual
function corPct(v) {
  if (v == null) return 'var(--cinza)';
  if (v >= 80) return 'var(--ok)';
  if (v >= 60) return 'var(--atencao)';
  return 'var(--alerta)';
}

// Sidebar HTML — injetado em cada página
function renderSidebar() {
  return `
<button class="mob-toggle" id="mobToggle">☰</button>
<div class="sidebar">
  <div class="sb-logo">
    <a href="../index.html" style="display:contents">
      <img src="../assets/logo_aasec.png" alt="AASEC">
    </a>
    <strong>Gestão</strong>
    <span>CEI Betel · Esco-Lar</span>
  </div>
  <div class="sb-unidade"><span id="sb-unidade"></span></div>
  <nav>
    <div class="nav-label">Indicadores</div>
    <a class="nav-item" href="indicadores.html" data-page="indicadores"><span class="nav-icon">📊</span> Painel Institucional</a>
    <div class="nav-label">Registrar dados</div>
    <a class="nav-item" href="lrco.html" data-page="lrco"><span class="nav-icon">📋</span> Dados Operacionais</a>
    <a class="nav-item" href="reunioes.html" data-page="reunioes"><span class="nav-icon">👨‍👩‍👧</span> Reuniões de Família</a>
    <div class="nav-label">Documentos</div>
    <a class="nav-item" href="documentos.html" data-page="documentos"><span class="nav-icon">📁</span> Documentos & PCs</a>
    <div class="nav-label">Configuração</div>
    <a class="nav-item" href="cadastros.html" data-page="cadastros"><span class="nav-icon">⚙️</span> Cadastros</a>
  </nav>
  <div class="sb-bottom">
    <a href="../index.html">← Voltar ao site</a>
    <a href="#" onclick="sair()" style="margin-top:6px">⏻ Sair</a>
  </div>
</div>`;
}
