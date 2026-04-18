/**
 * Área Docente Betel — Módulo de Dados
 * Banco de dados local via localStorage
 * Pronto para migração a API REST
 */

const DB = {
  // ===== USUÁRIOS =====
  getUsuarios: () => JSON.parse(localStorage.getItem('betel_usuarios') || '[]'),
  salvarUsuarios: (u) => localStorage.setItem('betel_usuarios', JSON.stringify(u)),
  addUsuario: (u) => {
    const lista = DB.getUsuarios();
    u.id = Date.now().toString();
    u.criado_em = new Date().toISOString();
    lista.push(u);
    DB.salvarUsuarios(lista);
    return u;
  },
  updateUsuario: (id, dados) => {
    const lista = DB.getUsuarios().map(u => u.id===id ? {...u,...dados} : u);
    DB.salvarUsuarios(lista);
  },
  deleteUsuario: (id) => DB.salvarUsuarios(DB.getUsuarios().filter(u=>u.id!==id)),
  getUsuario: (id) => DB.getUsuarios().find(u=>u.id===id),

  // ===== TURMAS =====
  getTurmas: () => JSON.parse(localStorage.getItem('betel_turmas') || '[]'),
  salvarTurmas: (t) => localStorage.setItem('betel_turmas', JSON.stringify(t)),
  addTurma: (t) => {
    const lista = DB.getTurmas();
    t.id = Date.now().toString();
    t.criado_em = new Date().toISOString();
    lista.push(t);
    DB.salvarTurmas(lista);
    return t;
  },
  updateTurma: (id, dados) => {
    const lista = DB.getTurmas().map(t => t.id===id ? {...t,...dados} : t);
    DB.salvarTurmas(lista);
  },
  deleteTurma: (id) => DB.salvarTurmas(DB.getTurmas().filter(t=>t.id!==id)),
  getTurma: (id) => DB.getTurmas().find(t=>t.id===id),

  // ===== CRIANÇAS =====
  getCriancas: () => JSON.parse(localStorage.getItem('betel_criancas') || '[]'),
  salvarCriancas: (c) => localStorage.setItem('betel_criancas', JSON.stringify(c)),
  addCrianca: (c) => {
    const lista = DB.getCriancas();
    c.id = Date.now().toString();
    c.criado_em = new Date().toISOString();
    lista.push(c);
    DB.salvarCriancas(lista);
    return c;
  },
  updateCrianca: (id, dados) => {
    const lista = DB.getCriancas().map(c => c.id===id ? {...c,...dados} : c);
    DB.salvarCriancas(lista);
  },
  deleteCrianca: (id) => DB.salvarCriancas(DB.getCriancas().filter(c=>c.id!==id)),
  getCrianca: (id) => DB.getCriancas().find(c=>c.id===id),
  getCriancasPorTurma: (turmaId) => DB.getCriancas().filter(c=>c.turma_id===turmaId && c.ativo!==false),

  // ===== RESPONSÁVEIS =====
  getResponsaveis: () => JSON.parse(localStorage.getItem('betel_responsaveis') || '[]'),
  salvarResponsaveis: (r) => localStorage.setItem('betel_responsaveis', JSON.stringify(r)),
  addResponsavel: (r) => {
    const lista = DB.getResponsaveis();
    r.id = Date.now().toString();
    r.criado_em = new Date().toISOString();
    lista.push(r);
    DB.salvarResponsaveis(lista);
    return r;
  },
  updateResponsavel: (id, dados) => {
    const lista = DB.getResponsaveis().map(r => r.id===id ? {...r,...dados} : r);
    DB.salvarResponsaveis(lista);
  },
  deleteResponsavel: (id) => DB.salvarResponsaveis(DB.getResponsaveis().filter(r=>r.id!==id)),
  getResponsavel: (id) => DB.getResponsaveis().find(r=>r.id===id),
  getResponsaveisPorCrianca: (criancaId) => DB.getResponsaveis().filter(r=>r.crianca_id===criancaId),

  // ===== AVALIAÇÕES =====
  getAvaliacoes: () => JSON.parse(localStorage.getItem('betel_avaliacoes') || '[]'),
  salvarAvaliacoes: (a) => localStorage.setItem('betel_avaliacoes', JSON.stringify(a)),
  addAvaliacao: (a) => {
    // Upsert por crianca_id + mes
    let lista = DB.getAvaliacoes();
    const idx = lista.findIndex(x=>x.crianca_id===a.crianca_id && x.mes===a.mes);
    if(idx>=0) { lista[idx] = {...lista[idx],...a, atualizado_em: new Date().toISOString()}; }
    else { a.id = Date.now().toString(); a.criado_em = new Date().toISOString(); lista.push(a); }
    DB.salvarAvaliacoes(lista);
    return a;
  },
  getAvaliacaoCriancaMes: (criancaId, mes) => DB.getAvaliacoes().find(a=>a.crianca_id===criancaId && a.mes===mes),
  getAvaliacoesTurmaMes: (turmaId, mes) => {
    const criancas = DB.getCriancasPorTurma(turmaId).map(c=>c.id);
    return DB.getAvaliacoes().filter(a=>criancas.includes(a.crianca_id) && a.mes===mes);
  },


  // ===== DADOS LRCO =====
  getLrco: () => JSON.parse(localStorage.getItem('betel_lrco') || '[]'),
  salvarLrco: (d) => localStorage.setItem('betel_lrco', JSON.stringify(d)),
  addLrco: (d) => {
    const lista = DB.getLrco();
    d.id = Date.now().toString();
    d.criado_em = new Date().toISOString();
    lista.push(d);
    DB.salvarLrco(lista);
    return d;
  },
  updateLrco: (id, dados) => {
    const lista = DB.getLrco().map(x => x.id===id ? {...x,...dados} : x);
    DB.salvarLrco(lista);
  },
  deleteLrco: (id) => DB.salvarLrco(DB.getLrco().filter(x=>x.id!==id)),
  getLrcoItem: (id) => DB.getLrco().find(x=>x.id===id),

  // ===== DADOS REUNIÕES =====
  getReunioes: () => JSON.parse(localStorage.getItem('betel_reunioes') || '[]'),
  salvarReunioes: (d) => localStorage.setItem('betel_reunioes', JSON.stringify(d)),
  addReuniao: (d) => {
    const lista = DB.getReunioes();
    d.id = Date.now().toString();
    d.criado_em = new Date().toISOString();
    lista.push(d);
    DB.salvarReunioes(lista);
    return d;
  },
  updateReuniao: (id, dados) => {
    const lista = DB.getReunioes().map(x => x.id===id ? {...x,...dados} : x);
    DB.salvarReunioes(lista);
  },
  deleteReuniao: (id) => DB.salvarReunioes(DB.getReunioes().filter(x=>x.id!==id)),
  getReuniaoItem: (id) => DB.getReunioes().find(x=>x.id===id),
  // ===== SESSÃO =====
  getSessao: () => JSON.parse(sessionStorage.getItem('betel_sessao') || 'null'),
  setSessao: (u) => sessionStorage.setItem('betel_sessao', JSON.stringify(u)),
  logout: () => { sessionStorage.removeItem('betel_sessao'); window.location.href='login.html'; },

  // ===== SEED dados iniciais =====
  seed: () => {
    if(DB.getTurmas().length > 0) return; // já tem dados

    // Turmas
    const t1 = DB.addTurma({nome:'Berçário',faixa:'0 a 1 ano',capacidade:8,ativo:true});
    const t2 = DB.addTurma({nome:'Maternal I',faixa:'1 a 2 anos',capacidade:12,ativo:true});
    const t3 = DB.addTurma({nome:'Maternal II',faixa:'2 a 3 anos',capacidade:12,ativo:true});
    const t4 = DB.addTurma({nome:'Jardim I',faixa:'4 a 5 anos',capacidade:15,ativo:true});

    // Usuários
    DB.addUsuario({nome:'Diretora Geral',email:'diretora@betel.org.br',senha:'123456',perfil:'diretora',turma_id:null,ativo:true});
    DB.addUsuario({nome:'Coordenação Pedagógica',email:'coord@betel.org.br',senha:'123456',perfil:'coordenacao',turma_id:null,ativo:true});
    const p1 = DB.addUsuario({nome:'Profª Mariana Silva',email:'mariana@betel.org.br',senha:'123456',perfil:'professora',turma_id:t1.id,ativo:true});
    DB.addUsuario({nome:'Profª Juliana Ramos',email:'juliana@betel.org.br',senha:'123456',perfil:'professora',turma_id:t2.id,ativo:true});
    DB.addUsuario({nome:'Administrativo',email:'admin@betel.org.br',senha:'123456',perfil:'admin',turma_id:null,ativo:true});

    // Vincular professora às turmas
    DB.updateTurma(t1.id,{professora_id:p1.id,professora_nome:'Profª Mariana Silva'});

    // Crianças
    const criancas = [
      {nome:'Isabela Santos',dt_nasc:'2024-03-15',turma_id:t1.id,matricula:'2026-02-01',resp_nome:'Ana Santos',resp_tel:'(42) 9 9111-1111',ativo:true,alergias:'',restricoes:'',obs:''},
      {nome:'Pedro Oliveira',dt_nasc:'2024-07-22',turma_id:t1.id,matricula:'2026-02-01',resp_nome:'Carlos Oliveira',resp_tel:'(42) 9 9222-2222',ativo:true},
      {nome:'Laura Ferreira',dt_nasc:'2025-01-10',turma_id:t1.id,matricula:'2026-02-15',resp_nome:'Maria Ferreira',resp_tel:'(42) 9 9333-3333',ativo:true},
      {nome:'Miguel Alves',dt_nasc:'2025-02-28',turma_id:t1.id,matricula:'2026-03-01',resp_nome:'Paulo Alves',resp_tel:'(42) 9 9444-4444',ativo:true},
      {nome:'Sofia Torres',dt_nasc:'2024-05-14',turma_id:t1.id,matricula:'2026-02-01',resp_nome:'Família Torres',resp_tel:'(42) 9 9555-5555',ativo:true},
      {nome:'Davi Costa',dt_nasc:'2025-03-08',turma_id:t1.id,matricula:'2026-02-01',resp_nome:'Roberto Costa',resp_tel:'(42) 9 9666-6666',ativo:true},
      {nome:'Ana Beatriz Lima',dt_nasc:'2022-09-20',turma_id:t3.id,matricula:'2026-02-01',resp_nome:'Joana Lima',resp_tel:'(42) 9 9777-7777',ativo:true},
      {nome:'Lucas Martins',dt_nasc:'2021-11-05',turma_id:t4.id,matricula:'2026-02-01',resp_nome:'Fernando Martins',resp_tel:'(42) 9 9888-8888',ativo:true},
    ];
    criancas.forEach(c => DB.addCrianca(c));

    console.log('✅ Dados iniciais carregados com sucesso.');
  }
};

// Inicializar seed ao carregar
DB.seed();
