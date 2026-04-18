# AASEC — Handoff para Implantação em Servidor
**Preparado por:** Oma (IA assistente de Dennis Verschoor)  
**Data:** 17/04/2026  
**Responsável pela implantação:** Eric Verschoor

---

## 📁 Estrutura do Projeto

```
aasec/
├── index.html              ← Site público — página inicial AASEC
├── cei-betel.html          ← Página pública do CEI Betel
├── esco-lar.html           ← Página pública do Esco-Lar
├── prestacoes.html         ← Página pública de prestações de contas
├── dados_docs.js           ← Base de dados de documentos (fonte única)
├── server.js               ← Servidor Node.js (uploads, backup, lixeira)
├── package.json            ← Dependências Node.js
├── node_modules/           ← Dependências instaladas (busboy)
│
├── assets/
│   ├── logo_aasec.png
│   ├── logo_betel.png
│   └── logo_escolar_b.png
│
├── docs/
│   ├── institucional/      ← 9 documentos institucionais
│   └── prestacoes/
│       └── betel/          ← Prestações CEI Betel (2020–2026)
│           ├── 2020/       ← 11 PDFs
│           ├── 2021/       ← 12 PDFs
│           ├── 2022/       ← 10 PDFs
│           ├── 2023/       ← 12 PDFs
│           ├── 2024/       ← 12 PDFs
│           ├── 2025/       ← 12 PDFs
│           └── 2026/       ← 3 PDFs (jan–mar)
│
├── gestao/                 ← Sistema de gestão interna (acesso restrito)
│   ├── login.html
│   ├── indicadores.html
│   ├── lrco.html
│   ├── reunioes.html
│   ├── documentos.html
│   ├── cadastros.html
│   ├── _nav.js
│   ├── dados.js
│   ├── cadastros.js
│   └── estilos.css
│
├── docs_backup/            ← Backups automáticos diários (mantém 30 dias)
└── _lixeira/               ← Arquivos "apagados" (recuperáveis)
```

---

## ✅ O que já está funcionando

### Site Público (`index.html`, `cei-betel.html`, `esco-lar.html`)
- Páginas institucionais completas com identidade visual AASEC
- Seção de documentos carregada automaticamente de `dados_docs.js`
- Prestações de contas acessíveis em `prestacoes.html`
- Links para o sistema de gestão interna

### Sistema de Gestão (`/gestao/`)
- **Login** com controle de sessão por perfil (diretora, coordenadora)
- **Painel de indicadores** institucional
- **Dados operacionais** (LRCO)
- **Reuniões de família**
- **Documentos & Prestações de Contas:**
  - Listagem com filtros por tipo, unidade e ano
  - Upload de novos documentos com destino automático
  - Edição de metadados
  - Exclusão com lixeira (arquivos recuperáveis)
  - Prévia de origem/destino antes de salvar
- **Cadastros**

### Servidor Node.js (`server.js`)
- Serve todos os arquivos estáticos
- Aceita upload de documentos via `POST /upload`
- Move arquivos apagados para `_lixeira/` (não apaga definitivamente)
- Backup automático diário de todos os `docs/` → `docs_backup/YYYY-MM-DD/`
- Remove backups com mais de 30 dias automaticamente

---

## ⚠️ O que ainda precisa ser feito

### Prioridade Alta (antes de ir ao ar)
1. **Domínio e hospedagem**
   - Registrar domínio (sugestão: `aasec.org.br` ou `aasec.carambeí.org.br`)
   - Contratar VPS ou hosting com Node.js (sugestão: Hostinger VPS, DigitalOcean, ou Hetzner)
   - Configurar HTTPS (certificado SSL — gratuito via Let's Encrypt)

2. **Processo permanente do servidor**
   - Instalar `pm2` para manter o servidor rodando:
     ```bash
     npm install -g pm2
     pm2 start server.js --name aasec
     pm2 startup
     pm2 save
     ```

3. **Esco-Lar — prestações de contas**
   - Edi ainda não enviou os arquivos
   - Quando enviar: colocar em `docs/prestacoes/escoLar/YYYY/`
   - Adicionar entradas em `dados_docs.js` (mesmo padrão da Betel)

4. **Links públicos dos documentos**
   - Atualmente os links são `/docs/...` (relativos ao servidor local)
   - Quando o site estiver no servidor, funcionarão automaticamente
   - Não precisa alterar nenhum código

### Prioridade Média
5. **Autenticação no servidor** (Camada 3 de segurança)
   - Atualmente upload/apagar aceitam qualquer requisição
   - Sugestão: validar token da sessão no servidor antes de aceitar

6. **Backup externo**
   - O backup atual é na mesma máquina — se o servidor cair, perde tudo
   - Sugestão: sincronizar `docs/` com Google Drive ou S3 periodicamente

7. **Prestações de contas 2026 — meses futuros**
   - Abril em diante: a secretária faz upload pelo sistema de gestão
   - `dados_docs.js` precisa ser atualizado a cada novo mês disponível
   - (Futuro: automatizar leitura da pasta)

### Prioridade Baixa
8. **Backend real para dados de gestão**
   - Atualmente LRCO, reuniões e indicadores usam `localStorage` do browser
   - Para múltiplos usuários simultâneos, precisa de banco de dados (MySQL/PostgreSQL)
   - Os documentos já funcionam no servidor — só os dados operacionais ainda são locais

---

## 🚀 Como subir o servidor

```bash
# 1. Entrar na pasta do projeto
cd /caminho/para/aasec

# 2. Instalar dependências
npm install

# 3. Iniciar o servidor
node server.js

# 4. Acessar
# Site público:  http://localhost:3000
# Gestão:        http://localhost:3000/gestao/login.html
```

### Credenciais de acesso (gestão interna)
| Perfil | E-mail | Senha |
|--------|--------|-------|
| Diretora | diretora@aasec.org.br | aasec2026 |
| Coordenadora Betel | coord@aasec.org.br | betel2026 |
| Coordenadora Esco-Lar | escolar@aasec.org.br | escolar2026 |

> ⚠️ **Trocar as senhas antes de colocar em produção!**

---

## 📞 Contatos para dúvidas
- **Dennis Verschoor** — dennis@deltad.com.br — (42) 99127-1255
- **CEI Betel** — aasec.betel@gmail.com — (42) 3231-5326
- **Esco-Lar** — esco-lar@hotmail.com — (42) 3231-4245
