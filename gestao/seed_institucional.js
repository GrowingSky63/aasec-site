/**
 * Seed — Documentos Institucionais AASEC com links para download
 */
(function seedInstitucional() {
  // Remover registros institucionais antigos para recriar com links
  let docs = JSON.parse(localStorage.getItem('aasec_docs') || '[]');
  docs = docs.filter(d => d.tipo === 'prestacao'); // manter só PCs
  
  const agora = new Date().toISOString();
  const base = 'docs/institucional/'; // relativo ao index.html // relativo ao docente/

  const registros = [
    // AASEC geral
    { nome:'Estatuto AASEC', tipo:'institucional', unidade:'AASEC', ano:null,
      arquivo:'AASEC ESTATUTO.docx', obs:'Documento constitutivo da AASEC',
      link: base + 'AASEC ESTATUTO.docx' },
    { nome:'Estrutura Organizacional AASEC', tipo:'institucional', unidade:'AASEC', ano:null,
      arquivo:'AASEC_Estrutura_Organizacional.pdf', obs:null,
      link: base + 'AASEC_Estrutura_Organizacional.pdf' },

    // CEI Betel
    { nome:'1º Aditivo — Termo de Colaboração CEI Betel', tipo:'contrato', unidade:'CEI Betel', ano:'2025',
      arquivo:'CEI A 2025-12-03 print Primeiro_Aditivo_Termo_de_Colaboracao_Creche_Betel.pdf',
      obs:'Assinado em dezembro/2025',
      link: base + 'CEI A 2025-12-03 print Primeiro_Aditivo_Termo_de_Colaboracao_Creche_Betel.pdf' },
    { nome:'Plano de Trabalho CEI Betel 2026', tipo:'institucional', unidade:'CEI Betel', ano:'2026',
      arquivo:'CEI B 2026 Plano de trabalho - CEI Betel.pdf', obs:null,
      link: base + 'CEI B 2026 Plano de trabalho - CEI Betel.pdf' },
    { nome:'Regimento Interno CEI Betel', tipo:'institucional', unidade:'CEI Betel', ano:'2022',
      arquivo:'CEI C 2022-06-21 Regimento interno legalizado.pdf', obs:'Legalizado em junho/2022',
      link: base + 'CEI C 2022-06-21 Regimento interno legalizado.pdf' },
    { nome:'Código de Ética CEI Betel', tipo:'institucional', unidade:'CEI Betel', ano:'2026',
      arquivo:'CEI D 2026 Codigo_de_Etica_CEI_Betel_Padronizado.pdf', obs:null,
      link: base + 'CEI D 2026 Codigo_de_Etica_CEI_Betel_Padronizado.pdf' },

    // Esco-Lar
    { nome:'Termo de Referência — Serviço de Convivência 2025-2026', tipo:'contrato', unidade:'Esco-Lar', ano:'2026',
      arquivo:'ESCO-LAR A 2026 Termo de Referência serviço de Convivência 2025-2026.pdf', obs:null,
      link: base + 'ESCO-LAR A 2026 Termo de Refer%C3%AAncia servi%C3%A7o de Conviv%C3%AAncia 2025-2026.pdf' },
    { nome:'Plano de Trabalho Esco-Lar 2026', tipo:'institucional', unidade:'Esco-Lar', ano:'2026',
      arquivo:'ESCO-LAR B 2026 Plano de Trabalho.pdf.pdf', obs:null,
      link: base + 'ESCO-LAR B 2026 Plano de Trabalho.pdf.pdf' },
    { nome:'Regimento Interno Esco-Lar', tipo:'institucional', unidade:'Esco-Lar', ano:'2025',
      arquivo:'ESCO-LAR D 2025 Regimento Interno.pdf', obs:null,
      link: base + 'ESCO-LAR D 2025 Regimento Interno.pdf' },
  ].map(d => ({
    id: Date.now().toString() + Math.random().toString(36).substr(2,6),
    mes: null, criado_em: agora, ...d
  }));

  localStorage.setItem('aasec_docs', JSON.stringify([...docs, ...registros]));
  console.log(`✅ ${registros.length} documentos institucionais com links registrados.`);
  location.reload();
})();
