# AASEC — Plano do Projeto

**Última atualização:** 2026-06-18

---

## Visão Geral

Site institucional + sistema de gestão interna da **AASEC** (Associação de Assistência Social Evangélica de Carambeí).
Duas unidades: **CEI Betel** (creche) e **Esco-Lar** (programa para jovens).

- **Site em produção:** https://aasec.org/
- **Repositório:** https://github.com/GrowingSky63/aasec-site.git
- **Stack:** HTML/CSS/JS puro + Node.js (servidor) + busboy (uploads) + MSAL (auth Microsoft)
- **Infraestrutura:** Proxmox local → VM Nginx Proxy Manager (SSL/HTTPS via Cloudflare) → VM AASEC (Node.js porta 8080, diretório /www, systemd)
- **Deploy:** `git pull` na VM para código; upload pelo site ou SCP para PDFs
- **Autenticação:** Microsoft Entra ID (OAuth 2.0, Authorization Code Flow, Single Tenant)
- **Responsável servidor:** Eric Verschoor (63eric36@gmail.com)
- **Responsável projeto:** Dennis Verschoor (dennis@deltad.com.br)

---

## Concluído (2026-06-18)

- [x] **Autenticação Microsoft Entra ID** — Login via conta @aasec.org (OAuth 2.0)
- [x] **Sessão server-side** — Cookie httpOnly substitui sessionStorage
- [x] **Rotas protegidas** — POST /upload, /apagar, /api/* exigem autenticação
- [x] **Páginas protegidas** — /gestao/*.html redirecionam para login se sem sessão
- [x] **Removidas credenciais hardcoded** — Senhas eliminadas do código-fonte
- [x] **Botão "Entrar com Microsoft"** — Substituiu formulário de email/senha
- [x] App registrado no Entra ID (Client ID, Tenant ID, Client Secret)
- [x] Permissões configuradas (openid, profile, email, User.Read) com admin consent

## Concluído (2026-06-17)

- [x] Migração do repositório de `.openclaw/workspace/aasec` para `OneDrive/2026 AASEC/Site`
- [x] Cópia da pasta `docs/` (2 GB, 87 PDFs) para o novo diretório
- [x] Filtros por tipo de documento nas páginas públicas (Institucional, Contratos, Relatórios)
- [x] Filtros por unidade no index.html (AASEC, CEI Betel, Esco-Lar)
- [x] Filtros nas páginas das unidades (cei-betel.html, esco-lar.html)
- [x] Toggle nos botões de filtro (clicar novamente desmarca)
- [x] Tooltips descritivos em todos os botões de filtro
- [x] Botão "Prestações de Contas →" movido para linha de filtros (removido card azul separado)
- [x] Grade de documentos começa vazia (mostra só ao clicar num filtro)
- [x] Removido script legado quebrado das páginas de unidade
- [x] Levantamento completo da infraestrutura (Proxmox, VMs, NPM, SSL, deploy)

---

## Pendências conhecidas

### Prioridade Alta

- [x] ~~**Autenticação server-side**~~ — Resolvido com Microsoft Entra ID (2026-06-18)
- [x] ~~**Credenciais hardcoded**~~ — Removidas; login agora é via Microsoft (2026-06-18)
- [ ] **CORS aberto** — Servidor aceita requisições de qualquer origem (*)
- [ ] **Prestações Esco-Lar** — Aguardando arquivos da coordenadora Edi

### Prioridade Média

- [ ] **Backup externo dos PDFs** — Documentos uploadados pelo site existem SOMENTE na VM. Se a VM falhar, perde tudo
- [ ] **Configuração de e-mails** — Em andamento com Microsoft (domínio aasec.org, M365 Business Basic Nonprofit)
- [ ] **Limite de tamanho de upload** — Não existe validação no servidor
- [ ] **dados_docs.js manual** — Precisa atualizar manualmente a cada novo mês de prestação
- [ ] **Controle de perfis por grupo** — Mapear grupos do M365 (Admin, Betel, Esco-Lar) para permissões no sistema

### Prioridade Baixa

- [ ] **Migrar localStorage para banco de dados** — LRCO, reuniões e indicadores funcionam só em um navegador/máquina
- [ ] **Monitoramento/logs** — Sem alertas se o servidor cair
- [ ] **Relatórios** — Categoria existe nos filtros mas nenhum documento cadastrado ainda

---

## Deploy da autenticação (checklist)

- [ ] `git pull` na VM
- [ ] `npm install` na VM (instala @azure/msal-node e dotenv)
- [ ] Criar `.env` na VM com: AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_CLIENT_SECRET, SESSION_SECRET
- [ ] Reiniciar serviço (`sudo systemctl restart aasec` ou equivalente)
- [ ] Testar login em https://aasec.org/gestao/login.html

---

## Decisões tomadas

| Decisão | Motivo |
|---------|--------|
| OneDrive como pasta de trabalho | Serve como backup automático; projeto simples sem conflitos |
| Filtros tipo Opção B (botões inline) | Mais limpo, menos espaço visual, consistente |
| Grade começa vazia | Evita poluição visual; usuário escolhe o que quer ver |
| Sem botões "Todos/Todas" no index | Redundante com os filtros específicos |
| PDFs não vão no git | Já estavam no .gitignore; são estáticos e pesados (2 GB+) |
| Microsoft Entra ID para auth | Já incluso no M365 Nonprofit; elimina senhas no código; controle centralizado de acesso |
| Authorization Code Flow + Client Secret | Mais seguro que SPA/PKCE; secret fica só na VM, nunca no navegador |
| Single Tenant | Apenas contas @aasec.org podem acessar a gestão |
| Sessão in-memory com cookie httpOnly | Suficiente para o porte; sem dependência de Redis/banco |

---

## Arquivos-chave

| Arquivo | Função |
|---------|--------|
| `server.js` | Backend Node.js (auth, sessão, estáticos, upload, apagar, backup) |
| `.env` | Credenciais Entra ID e session secret (fora do git) |
| `dados_docs.js` | Cadastro mestre de documentos + função renderDocsPublico() |
| `index.html` | Página principal com seção Transparência |
| `prestacoes.html` | Página dedicada de prestações de contas |
| `cei-betel.html` | Página do CEI Betel com filtros de documentos |
| `esco-lar.html` | Página da Esco-Lar com filtros de documentos |
| `gestao/login.html` | Login via Microsoft Entra ID |
| `gestao/_nav.js` | Navegação, verificação de sessão via /auth/me, sidebar |
| `gestao/documentos.html` | Sistema interno de upload/gestão de documentos |
| `gestao/cadastros.js` | Cadastros de unidades, turmas e usuários (sem senhas) |
