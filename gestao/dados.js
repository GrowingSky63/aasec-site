/**
 * AASEC — Dados Institucionais
 * Banco local via localStorage
 * Modelo: LRCO + Reuniões de Família
 */

const DB = {

  // ===== LRCO =====
  getLrco: () => JSON.parse(localStorage.getItem('aasec_lrco') || '[]'),
  _saveLrco: (d) => localStorage.setItem('aasec_lrco', JSON.stringify(d)),

  addLrco(d) {
    const lista = this.getLrco();
    d.id = Date.now().toString();
    d.criado_em = new Date().toISOString();
    lista.push(d);
    this._saveLrco(lista);
    return d;
  },
  updateLrco(id, dados) {
    this._saveLrco(this.getLrco().map(x => x.id === id ? { ...x, ...dados } : x));
  },
  deleteLrco(id) {
    this._saveLrco(this.getLrco().filter(x => x.id !== id));
  },
  getLrcoItem: (id) => DB.getLrco().find(x => x.id === id),

  // ===== REUNIÕES =====
  getReunioes: () => JSON.parse(localStorage.getItem('aasec_reunioes') || '[]'),
  _saveReunioes: (d) => localStorage.setItem('aasec_reunioes', JSON.stringify(d)),

  addReuniao(d) {
    const lista = this.getReunioes();
    d.id = Date.now().toString();
    d.criado_em = new Date().toISOString();
    lista.push(d);
    this._saveReunioes(lista);
    return d;
  },
  updateReuniao(id, dados) {
    this._saveReunioes(this.getReunioes().map(x => x.id === id ? { ...x, ...dados } : x));
  },
  deleteReuniao(id) {
    this._saveReunioes(this.getReunioes().filter(x => x.id !== id));
  },
  getReuniaoItem: (id) => DB.getReunioes().find(x => x.id === id),

  // ===== HELPERS =====
  periodosMes() {
    const set = new Set([
      ...this.getLrco().map(x => x.periodo)
    ]);
    return [...set].sort().reverse();
  },
  periodosTrimestre() {
    const set = new Set(this.getReunioes().map(x => x.periodo));
    return [...set].sort().reverse();
  }
};

// Utilitários de formatação
function fmtMes(yyyymm) {
  if (!yyyymm) return '—';
  const [y, m] = yyyymm.split('-');
  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                 'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  return `${meses[parseInt(m) - 1]} ${y}`;
}

function fmtTrimestre(periodo) {
  if (!periodo) return '—';
  const [y, t] = periodo.split('-');
  return `${t} ${y}`;
}

function mesAtual() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function trimestreAtual() {
  const m = new Date().getMonth();
  const t = m < 3 ? 'T1' : m < 6 ? 'T2' : m < 9 ? 'T3' : 'T4';
  return `${new Date().getFullYear()}-${t}`;
}

function toast(msg, tipo = 'ok') {
  let el = document.getElementById('_toast');
  if (!el) {
    el = document.createElement('div');
    el.id = '_toast';
    el.style.cssText = 'position:fixed;bottom:20px;right:20px;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;font-family:Inter,sans-serif;z-index:9999;display:none;align-items:center;gap:8px;box-shadow:0 8px 24px rgba(0,0,0,.2);transition:all .25s';
    document.body.appendChild(el);
  }
  el.style.background = tipo === 'ok' ? '#4a7c1f' : '#ef4444';
  el.style.color = '#fff';
  el.innerHTML = `${tipo === 'ok' ? '✅' : '❌'} ${msg}`;
  el.style.display = 'flex';
  clearTimeout(el._t);
  el._t = setTimeout(() => el.style.display = 'none', 2800);
}
