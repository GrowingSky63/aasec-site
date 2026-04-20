/**
 * AASEC — Dados de documentos
 * Fonte única de verdade. Não depende de localStorage.
 */

const AASEC_DOCS = [
  // ── INSTITUCIONAL ──────────────────────────────────────────────────────
  {
    nome: 'Estatuto AASEC', tipo: 'institucional', unidade: 'AASEC',
    link: '/docs/institucional/AASEC/AASEC ESTATUTO.docx'
  },
  {
    nome: 'Estrutura Organizacional AASEC', tipo: 'institucional', unidade: 'AASEC',
    link: '/docs/institucional/AASEC/AASEC_Estrutura_Organizacional.pdf'
  },
  {
    nome: '1º Aditivo — Termo de Colaboração CEI Betel', tipo: 'contrato', unidade: 'CEI Betel', ano: '2025',
    link: '/docs/institucional/CEI Betel/CEI A 2025-12-03 print Primeiro_Aditivo_Termo_de_Colaboracao_Creche_Betel.pdf'
  },
  {
    nome: 'Plano de Trabalho CEI Betel 2026', tipo: 'institucional', unidade: 'CEI Betel', ano: '2026',
    link: '/docs/institucional/CEI Betel/CEI B 2026 Plano de trabalho - CEI Betel.pdf'
  },
  {
    nome: 'Regimento Interno CEI Betel', tipo: 'institucional', unidade: 'CEI Betel', ano: '2022',
    link: '/docs/institucional/CEI Betel/CEI C 2022-06-21 Regimento interno legalizado.pdf'
  },
  {
    nome: 'Código de Ética CEI Betel', tipo: 'institucional', unidade: 'CEI Betel', ano: '2026',
    link: '/docs/institucional/CEI Betel/CEI D 2026 Codigo_de_Etica_CEI_Betel_Padronizado.pdf'
  },
  {
    nome: 'Termo de Referência Esco-Lar 2025-2026', tipo: 'contrato', unidade: 'Esco-Lar', ano: '2026',
    link: '/docs/institucional/Esco-Lar/ESCO-LAR A 2026 Termo de Referência serviço de Convivência 2025-2026.pdf'
  },
  {
    nome: 'Plano de Trabalho Esco-Lar 2026', tipo: 'institucional', unidade: 'Esco-Lar', ano: '2026',
    link: '/docs/institucional/Esco-Lar/ESCO-LAR B 2026 Plano de Trabalho.pdf.pdf'
  },
  {
    nome: 'Regimento Interno Esco-Lar', tipo: 'institucional', unidade: 'Esco-Lar', ano: '2025',
    link: '/docs/institucional/Esco-Lar/ESCO-LAR D 2025 Regimento Interno.pdf'
  },

  // ── PRESTAÇÕES CEI BETEL — 2020 ────────────────────────────────────────
  { nome: 'Prestação de Contas — Fevereiro 2020', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2020', mes: '02', link: '/docs/prestacoes/CEI Betel/2020/022020.pdf' },
  { nome: 'Prestação de Contas — Março 2020', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2020', mes: '03', link: '/docs/prestacoes/CEI Betel/2020/032020.pdf' },
  { nome: 'Prestação de Contas — Abril 2020', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2020', mes: '04', link: '/docs/prestacoes/CEI Betel/2020/042020.pdf' },
  { nome: 'Prestação de Contas — Maio 2020', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2020', mes: '05', link: '/docs/prestacoes/CEI Betel/2020/052020.pdf' },
  { nome: 'Prestação de Contas — Junho 2020', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2020', mes: '06', link: '/docs/prestacoes/CEI Betel/2020/062020.pdf' },
  { nome: 'Prestação de Contas — Julho 2020', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2020', mes: '07', link: '/docs/prestacoes/CEI Betel/2020/072020.pdf' },
  { nome: 'Prestação de Contas — Agosto 2020', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2020', mes: '08', link: '/docs/prestacoes/CEI Betel/2020/082020.pdf' },
  { nome: 'Prestação de Contas — Setembro 2020', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2020', mes: '09', link: '/docs/prestacoes/CEI Betel/2020/092020.pdf' },
  { nome: 'Prestação de Contas — Outubro 2020', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2020', mes: '10', link: '/docs/prestacoes/CEI Betel/2020/102020.pdf' },
  { nome: 'Prestação de Contas — Novembro 2020', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2020', mes: '11', link: '/docs/prestacoes/CEI Betel/2020/112020.pdf' },
  { nome: 'Prestação de Contas — Dezembro 2020', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2020', mes: '12', link: '/docs/prestacoes/CEI Betel/2020/122020.pdf' },

  // ── 2021 ───────────────────────────────────────────────────────────────
  { nome: 'Prestação de Contas — Janeiro 2021', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2021', mes: '01', link: '/docs/prestacoes/CEI Betel/2021/012021.pdf' },
  { nome: 'Prestação de Contas — Fevereiro 2021', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2021', mes: '02', link: '/docs/prestacoes/CEI Betel/2021/022021.pdf' },
  { nome: 'Prestação de Contas — Março 2021', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2021', mes: '03', link: '/docs/prestacoes/CEI Betel/2021/032021.pdf' },
  { nome: 'Prestação de Contas — Abril 2021', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2021', mes: '04', link: '/docs/prestacoes/CEI Betel/2021/042021.pdf' },
  { nome: 'Prestação de Contas — Maio 2021', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2021', mes: '05', link: '/docs/prestacoes/CEI Betel/2021/052021.pdf' },
  { nome: 'Prestação de Contas — Junho 2021', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2021', mes: '06', link: '/docs/prestacoes/CEI Betel/2021/062021.pdf' },
  { nome: 'Prestação de Contas — Julho 2021', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2021', mes: '07', link: '/docs/prestacoes/CEI Betel/2021/072021.pdf' },
  { nome: 'Prestação de Contas — Agosto 2021', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2021', mes: '08', link: '/docs/prestacoes/CEI Betel/2021/082021.pdf' },
  { nome: 'Prestação de Contas — Setembro 2021', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2021', mes: '09', link: '/docs/prestacoes/CEI Betel/2021/092021.pdf' },
  { nome: 'Prestação de Contas — Outubro 2021', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2021', mes: '10', link: '/docs/prestacoes/CEI Betel/2021/102021.pdf' },
  { nome: 'Prestação de Contas — Novembro 2021', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2021', mes: '11', link: '/docs/prestacoes/CEI Betel/2021/112021.pdf' },
  { nome: 'Prestação de Contas — Dezembro 2021', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2021', mes: '12', link: '/docs/prestacoes/CEI Betel/2021/122021.pdf' },

  // ── 2022 ───────────────────────────────────────────────────────────────
  { nome: 'Prestação de Contas — Janeiro 2022', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2022', mes: '01', link: '/docs/prestacoes/CEI Betel/2022/012022.pdf' },
  { nome: 'Prestação de Contas — Fevereiro 2022', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2022', mes: '02', link: '/docs/prestacoes/CEI Betel/2022/022022.pdf' },
  { nome: 'Prestação de Contas — Maio 2022', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2022', mes: '05', link: '/docs/prestacoes/CEI Betel/2022/052022.pdf' },
  { nome: 'Prestação de Contas — Junho 2022', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2022', mes: '06', link: '/docs/prestacoes/CEI Betel/2022/062022.pdf' },
  { nome: 'Prestação de Contas — Julho 2022', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2022', mes: '07', link: '/docs/prestacoes/CEI Betel/2022/072022.pdf' },
  { nome: 'Prestação de Contas — Agosto 2022', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2022', mes: '08', link: '/docs/prestacoes/CEI Betel/2022/082022.pdf' },
  { nome: 'Prestação de Contas — Setembro 2022', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2022', mes: '09', link: '/docs/prestacoes/CEI Betel/2022/092022.pdf' },
  { nome: 'Prestação de Contas — Outubro 2022', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2022', mes: '10', link: '/docs/prestacoes/CEI Betel/2022/102022.pdf' },
  { nome: 'Prestação de Contas — Novembro 2022', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2022', mes: '11', link: '/docs/prestacoes/CEI Betel/2022/112022.pdf' },
  { nome: 'Prestação de Contas — Dezembro 2022', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2022', mes: '12', link: '/docs/prestacoes/CEI Betel/2022/122022.pdf' },

  // ── 2023 ───────────────────────────────────────────────────────────────
  { nome: 'Prestação de Contas — Janeiro 2023', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2023', mes: '01', link: '/docs/prestacoes/CEI Betel/2023/012023.pdf' },
  { nome: 'Prestação de Contas — Fevereiro 2023', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2023', mes: '02', link: '/docs/prestacoes/CEI Betel/2023/022023.pdf' },
  { nome: 'Prestação de Contas — Março 2023', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2023', mes: '03', link: '/docs/prestacoes/CEI Betel/2023/032023.pdf' },
  { nome: 'Prestação de Contas — Abril 2023', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2023', mes: '04', link: '/docs/prestacoes/CEI Betel/2023/042023.pdf' },
  { nome: 'Prestação de Contas — Maio 2023', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2023', mes: '05', link: '/docs/prestacoes/CEI Betel/2023/052023.pdf' },
  { nome: 'Prestação de Contas — Junho 2023', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2023', mes: '06', link: '/docs/prestacoes/CEI Betel/2023/062023.pdf' },
  { nome: 'Prestação de Contas — Julho 2023', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2023', mes: '07', link: '/docs/prestacoes/CEI Betel/2023/072023.pdf' },
  { nome: 'Prestação de Contas — Agosto 2023', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2023', mes: '08', link: '/docs/prestacoes/CEI Betel/2023/082023.pdf' },
  { nome: 'Prestação de Contas — Setembro 2023', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2023', mes: '09', link: '/docs/prestacoes/CEI Betel/2023/092023.pdf' },
  { nome: 'Prestação de Contas — Outubro 2023', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2023', mes: '10', link: '/docs/prestacoes/CEI Betel/2023/102023.pdf' },
  { nome: 'Prestação de Contas — Novembro 2023', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2023', mes: '11', link: '/docs/prestacoes/CEI Betel/2023/112023.pdf' },
  { nome: 'Prestação de Contas — Dezembro 2023', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2023', mes: '12', link: '/docs/prestacoes/CEI Betel/2023/122023.pdf' },

  // ── 2024 ───────────────────────────────────────────────────────────────
  { nome: 'Prestação de Contas — Janeiro 2024', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2024', mes: '01', link: '/docs/prestacoes/CEI Betel/2024/012024.pdf' },
  { nome: 'Prestação de Contas — Fevereiro 2024', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2024', mes: '02', link: '/docs/prestacoes/CEI Betel/2024/022024.pdf' },
  { nome: 'Prestação de Contas — Março 2024', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2024', mes: '03', link: '/docs/prestacoes/CEI Betel/2024/032024.pdf' },
  { nome: 'Prestação de Contas — Abril 2024', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2024', mes: '04', link: '/docs/prestacoes/CEI Betel/2024/042024.pdf' },
  { nome: 'Prestação de Contas — Maio 2024', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2024', mes: '05', link: '/docs/prestacoes/CEI Betel/2024/052024.pdf' },
  { nome: 'Prestação de Contas — Junho 2024', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2024', mes: '06', link: '/docs/prestacoes/CEI Betel/2024/062024.pdf' },
  { nome: 'Prestação de Contas — Julho 2024', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2024', mes: '07', link: '/docs/prestacoes/CEI Betel/2024/072024.pdf' },
  { nome: 'Prestação de Contas — Agosto 2024', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2024', mes: '08', link: '/docs/prestacoes/CEI Betel/2024/082024.pdf' },
  { nome: 'Prestação de Contas — Setembro 2024', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2024', mes: '09', link: '/docs/prestacoes/CEI Betel/2024/092024.pdf' },
  { nome: 'Prestação de Contas — Outubro 2024', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2024', mes: '10', link: '/docs/prestacoes/CEI Betel/2024/102024.pdf' },
  { nome: 'Prestação de Contas — Novembro 2024', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2024', mes: '11', link: '/docs/prestacoes/CEI Betel/2024/112024.pdf' },
  { nome: 'Prestação de Contas — Dezembro 2024', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2024', mes: '12', link: '/docs/prestacoes/CEI Betel/2024/122024.pdf' },

  // ── 2025 ───────────────────────────────────────────────────────────────
  { nome: 'Prestação de Contas — Janeiro 2025', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2025', mes: '01', link: '/docs/prestacoes/CEI Betel/2025/012025.pdf' },
  { nome: 'Prestação de Contas — Fevereiro 2025', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2025', mes: '02', link: '/docs/prestacoes/CEI Betel/2025/022025.pdf' },
  { nome: 'Prestação de Contas — Março 2025', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2025', mes: '03', link: '/docs/prestacoes/CEI Betel/2025/032025.pdf' },
  { nome: 'Prestação de Contas — Abril 2025', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2025', mes: '04', link: '/docs/prestacoes/CEI Betel/2025/042025.pdf' },
  { nome: 'Prestação de Contas — Maio 2025', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2025', mes: '05', link: '/docs/prestacoes/CEI Betel/2025/052025.pdf' },
  { nome: 'Prestação de Contas — Junho 2025', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2025', mes: '06', link: '/docs/prestacoes/CEI Betel/2025/062025.pdf' },
  { nome: 'Prestação de Contas — Julho 2025', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2025', mes: '07', link: '/docs/prestacoes/CEI Betel/2025/072025.pdf' },
  { nome: 'Prestação de Contas — Agosto 2025', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2025', mes: '08', link: '/docs/prestacoes/CEI Betel/2025/082025.pdf' },
  { nome: 'Prestação de Contas — Setembro 2025', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2025', mes: '09', link: '/docs/prestacoes/CEI Betel/2025/092025.pdf' },
  { nome: 'Prestação de Contas — Outubro 2025', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2025', mes: '10', link: '/docs/prestacoes/CEI Betel/2025/102025.pdf' },
  { nome: 'Prestação de Contas — Novembro 2025', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2025', mes: '11', link: '/docs/prestacoes/CEI Betel/2025/112025.pdf' },
  { nome: 'Prestação de Contas — Dezembro 2025', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2025', mes: '12', link: '/docs/prestacoes/CEI Betel/2025/122025.pdf' },

  // ── 2026 ───────────────────────────────────────────────────────────────
  { nome: 'Prestação de Contas — Janeiro 2026', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2026', mes: '01', link: '/docs/prestacoes/CEI Betel/2026/012026.pdf' },
  { nome: 'Prestação de Contas — Fevereiro 2026', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2026', mes: '02', link: '/docs/prestacoes/CEI Betel/2026/022026.pdf' },
  { nome: 'Prestação de Contas — Março 2026', tipo: 'prestacao', unidade: 'CEI Betel', ano: '2026', mes: '03', link: '/docs/prestacoes/CEI Betel/2026/032026.pdf' },
];

/**
 * Renderiza documentos institucionais (sem prestações) num elemento
 * @param {string} elementId — id do elemento alvo
 * @param {object} filtros — {unidade}
 */
function renderDocsPublico(elementId, filtros) {
  filtros = filtros || {};
  var el = document.getElementById(elementId);
  if (!el) return;

  var tipoIcone = { prestacao: '📊', institucional: '🏛️', contrato: '📝', relatorio: '📋' };

  var lista = AASEC_DOCS.filter(function (d) {
    if (d.tipo === 'prestacao') return false;
    if (!d.link) return false;
    if (filtros.unidade && d.unidade !== filtros.unidade && d.unidade !== 'AASEC') return false;
    return true;
  });

  if (!lista.length) {
    el.innerHTML = '<p style="color:#64748b;font-size:13px">Nenhum documento disponível para este filtro.</p>';
    return;
  }

  el.innerHTML = lista.map(function (d) {
    var icone = tipoIcone[d.tipo] || '📄';
    var periodo = d.ano || '';
    return '<a class="doc-card" href="' + d.link + '" target="_blank" style="text-decoration:none;cursor:pointer">'
      + '<div class="doc-icon">' + icone + '</div>'
      + '<div class="doc-info">'
      + '<strong>' + d.nome + '</strong>'
      + '<span>' + d.unidade + (periodo ? ' · ' + periodo : '') + '</span>'
      + '</div>'
      + '</a>';
  }).join('');
}
