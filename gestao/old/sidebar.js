/**
 * Sidebar compartilhada — Área Docente Betel
 */

function renderSidebar(paginaAtiva) {
  const sessao = DB.getSessao();
  if(!sessao && !window.location.href.includes('login')) {
    window.location.href = 'login.html';
    return;
  }

  const perfis = {
    diretora:{nome:'Diretora',badge:'Diretora',cor:'perfil-diretora'},
    coordenacao:{nome:'Coordenação',badge:'Coordenação',cor:'perfil-coordenacao'},
    professora:{nome:'Professora',badge:'Professora',cor:'perfil-professora'},
    admin:{nome:'Administrativo',badge:'Admin',cor:'perfil-admin'}
  };
  const perfil = sessao ? perfis[sessao.perfil] || perfis.professora : perfis.professora;
  const nome = sessao ? sessao.nome : '—';
  const cargo = sessao ? (sessao.cargo_turma || perfil.nome) : '—';

  const ehDiretora = sessao && sessao.perfil === 'diretora';
  const ehCoordenacao = sessao && ['diretora','coordenacao'].includes(sessao.perfil);
  const ehAdmin = sessao && ['diretora','admin'].includes(sessao.perfil);

  document.querySelector('.sp-nome').textContent = nome;
  document.querySelector('.sp-cargo').textContent = cargo;
  const badge = document.querySelector('.sp-badge');
  badge.textContent = perfil.badge;
  badge.className = `sp-badge ${perfil.cor}`;

  // Marcar item ativo
  document.querySelectorAll('.nav-item').forEach(a => {
    a.classList.toggle('ativo', a.getAttribute('data-page') === paginaAtiva);
  });

  // Ocultar itens por perfil
  if(!ehDiretora) {
    document.querySelectorAll('.nav-diretora').forEach(el => el.style.display = 'none');
  }
  if(!ehCoordenacao) {
    document.querySelectorAll('.nav-coordenacao').forEach(el => el.style.display = 'none');
  }
  if(!ehAdmin) {
    document.querySelectorAll('.nav-admin').forEach(el => el.style.display = 'none');
  }
}

// Toggle mobile
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('mobileToggle');
  const sidebar = document.querySelector('.sidebar');
  if(toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.querySelector('.main')?.addEventListener('click', () => sidebar.classList.remove('open'));
  }
});

// Toast helper
function toast(msg, tipo='ok', duracao=2500) {
  let t = document.getElementById('toast');
  if(!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.className = `toast visivel ${tipo}`;
  t.innerHTML = `<span>${tipo==='ok'?'✅':tipo==='erro'?'❌':'ℹ️'}</span> ${msg}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('visivel'), duracao);
}

// Confirmar exclusão
function confirmar(msg) {
  return confirm(msg || 'Tem certeza que deseja excluir?');
}

// Formatar data
function fmtData(iso) {
  if(!iso) return '—';
  const d = new Date(iso.includes('T') ? iso : iso + 'T00:00:00');
  return d.toLocaleDateString('pt-BR');
}

// Calcular idade
function calcIdade(dtNasc) {
  if(!dtNasc) return '—';
  const n = new Date(dtNasc + 'T00:00:00');
  const hoje = new Date();
  let anos = hoje.getFullYear() - n.getFullYear();
  let meses = hoje.getMonth() - n.getMonth();
  if(meses < 0) { anos--; meses += 12; }
  if(anos === 0) return `${meses} mes${meses!==1?'es':''}`;
  if(meses === 0) return `${anos} ano${anos!==1?'s':''}`;
  return `${anos}a ${meses}m`;
}

// Mes atual no formato YYYY-MM
function mesAtual() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}

function fmtMes(yyyymm) {
  if(!yyyymm) return '—';
  const [y, m] = yyyymm.split('-');
  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  return `${meses[parseInt(m)-1]} ${y}`;
}
