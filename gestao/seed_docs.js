/**
 * Seed — Prestações de Contas CEI Betel com links para download
 */
(function seedDocs() {
  let docs = JSON.parse(localStorage.getItem('aasec_docs') || '[]');
  // Remover PCs antigas para recriar com links
  docs = docs.filter(d => d.tipo !== 'prestacao');

  const agora = new Date().toISOString();
  const base = 'docs/prestacoes/CEI Betel/'; // relativo ao index.html
  const meses = ['','Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const registros = [];

  // 2020 — arquivos: 022020.pdf ... 122020.pdf
  ['02','03','04','05','06','07','08','09','10','11','12'].forEach(m => {
    registros.push({ mes:m, ano:'2020', arquivo:`${m}2020.pdf`,
      link: base + `2020/${m}2020.pdf` });
  });

  // 2021
  ['01','02','03','04','05','06','07','08','09','10','11','12'].forEach(m => {
    registros.push({ mes:m, ano:'2021', arquivo:`${m}2021.pdf`,
      link: base + `2021/${m}2021.pdf` });
  });

  // 2022
  ['01','02','05','06','07','08','09','10','11','12'].forEach(m => {
    registros.push({ mes:m, ano:'2022', arquivo:`${m}2022.pdf`,
      link: base + `2022/${m}2022.pdf` });
  });

  // 2023
  ['01','02','03','04','05','06','07','08','09','10','11','12'].forEach(m => {
    registros.push({ mes:m, ano:'2023', arquivo:`${m}2023.pdf`,
      link: base + `2023/${m}2023.pdf` });
  });

  // 2024 — subpastas por mês (número sem zero à esquerda como nome da pasta)
  [1,2,3,4,5,6,7,8,9,10,11,12].forEach(mn => {
    const m = String(mn).padStart(2,'0');
    // Arquivo consolidado da parcela (ex: PARCELA 13.pdf, PARCELA 14-15 e 16...)
    registros.push({ mes:m, ano:'2024', arquivo:`Parcela ${mn}`,
      obs:'Pasta com documentos detalhados',
      link: base + `2024/${mn}/PARCELA ${mn > 12 ? mn : mn}.pdf` });
  });

  // 2025 — arquivos: 012025.pdf ... 122025.pdf
  ['01','02','03','04','05','06','07','08','09','10','11','12'].forEach(m => {
    registros.push({ mes:m, ano:'2025', arquivo:`${m}2025.pdf`,
      link: base + `2025/${m}2025.pdf` });
  });

  // 2026 — disponíveis: 01, 02, 03
  ['01','02','03'].forEach(m => {
    registros.push({ mes:m, ano:'2026', arquivo:`${m}2026.pdf`,
      link: base + `2026/${m}2026.pdf` });
  });

  const finais = registros.map(r => ({
    id: Date.now().toString() + Math.random().toString(36).substr(2,6),
    nome: `Prestação de Contas — ${meses[parseInt(r.mes)]} ${r.ano}`,
    tipo: 'prestacao',
    unidade: 'CEI Betel',
    obs: r.obs || 'Arquivo consolidado mensal',
    arquivo: r.arquivo,
    link: r.link,
    mes: r.mes,
    ano: r.ano,
    criado_em: agora
  }));

  localStorage.setItem('aasec_docs', JSON.stringify([...docs, ...finais]));
  console.log(`✅ ${finais.length} prestações de contas com links registradas.`);
  location.reload();
})();
