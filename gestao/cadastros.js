/**
 * AASEC — Módulo de Cadastros
 * Usuários, Unidades e Turmas
 */

const DBc = {
  // ── Usuários ────────────────────────────────────
  getUsuarios: () => JSON.parse(localStorage.getItem('aasec_usuarios') || '[]'),
  _saveU: d => localStorage.setItem('aasec_usuarios', JSON.stringify(d)),
  addUsuario(d) { const l=this.getUsuarios(); d.id=Date.now().toString(); l.push(d); this._saveU(l); return d; },
  updateUsuario(id,d) { this._saveU(this.getUsuarios().map(x=>x.id===id?{...x,...d}:x)); },
  deleteUsuario(id) { this._saveU(this.getUsuarios().filter(x=>x.id!==id)); },
  getUsuario: id => DBc.getUsuarios().find(x=>x.id===id),

  // ── Unidades ────────────────────────────────────
  getUnidades: () => JSON.parse(localStorage.getItem('aasec_unidades') || '[]'),
  _saveUn: d => localStorage.setItem('aasec_unidades', JSON.stringify(d)),
  addUnidade(d) { const l=this.getUnidades(); d.id=Date.now().toString(); l.push(d); this._saveUn(l); return d; },
  updateUnidade(id,d) { this._saveUn(this.getUnidades().map(x=>x.id===id?{...x,...d}:x)); },
  deleteUnidade(id) { this._saveUn(this.getUnidades().filter(x=>x.id!==id)); },
  getUnidade: id => DBc.getUnidades().find(x=>x.id===id),
  getUnidadesAtivas: () => DBc.getUnidades().filter(u=>u.ativa!==false),

  // ── Turmas ──────────────────────────────────────
  getTurmas: () => JSON.parse(localStorage.getItem('aasec_turmas') || '[]'),
  _saveT: d => localStorage.setItem('aasec_turmas', JSON.stringify(d)),
  addTurma(d) { const l=this.getTurmas(); d.id=Date.now().toString(); l.push(d); this._saveT(l); return d; },
  updateTurma(id,d) { this._saveT(this.getTurmas().map(x=>x.id===id?{...x,...d}:x)); },
  deleteTurma(id) { this._saveT(this.getTurmas().filter(x=>x.id!==id)); },
  getTurma: id => DBc.getTurmas().find(x=>x.id===id),
  getTurmasPorUnidade: (unidadeNome) => DBc.getTurmas().filter(t=>t.unidade_nome===unidadeNome&&t.ativa!==false),

  // ── Seed inicial ────────────────────────────────
  seed() {
    if (this.getUnidades().length) return;
    const u1 = this.addUnidade({ nome:'CEI Betel', tipo:'educacional', ativa:true });
    const u2 = this.addUnidade({ nome:'Esco-Lar', tipo:'socioassistencial', ativa:true });
    ['Berçário','Maternal I','Maternal II','Jardim I'].forEach(n => {
      this.addTurma({ nome:n, unidade_id:u1.id, unidade_nome:u1.nome, periodo:'manha', ativa:true });
    });
    this.addUsuario({ nome:'Diretora AASEC', email:'diretora@aasec.org.br', senha:'aasec2026', tipo:'admin', ativo:true });
    this.addUsuario({ nome:'Coordenação Betel', email:'coord@aasec.org.br', senha:'betel2026', tipo:'coord', ativo:true });
    this.addUsuario({ nome:'Esco-Lar', email:'escolar@aasec.org.br', senha:'escolar2026', tipo:'coord', ativo:true });
  }
};

// Executar seed ao carregar
DBc.seed();

/**
 * Popula todos os selects com classe .select-unidade
 * usando as unidades ativas do cadastro
 */
function carregarSelectsUnidade() {
  const unidades = DBc.getUnidadesAtivas();
  document.querySelectorAll('.select-unidade').forEach(sel => {
    const valorAtual = sel.value;
    // Manter só a primeira opção (placeholder)
    while (sel.options.length > 1) sel.remove(1);
    unidades.forEach(u => {
      const o = document.createElement('option');
      o.value = u.nome;
      o.textContent = u.nome;
      sel.appendChild(o);
    });
    // Restaurar valor se ainda existir
    if (valorAtual) sel.value = valorAtual;
  });
}

/**
 * Popula selects de turma filtrados por unidade
 */
function carregarSelectsTurma(selectId, unidadeNome) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  while (sel.options.length > 1) sel.remove(1);
  DBc.getTurmasPorUnidade(unidadeNome).forEach(t => {
    const o = document.createElement('option');
    o.value = t.nome;
    o.textContent = `${t.nome}${t.periodo ? ' · ' + {manha:'Manhã',tarde:'Tarde',integral:'Integral'}[t.periodo] : ''}`;
    sel.appendChild(o);
  });
}

/**
 * Login com usuários do cadastro
 */
function autenticarUsuario(email, senha) {
  return DBc.getUsuarios().find(u =>
    u.email.toLowerCase() === email.toLowerCase() &&
    u.senha === senha &&
    u.ativo !== false
  ) || null;
}
