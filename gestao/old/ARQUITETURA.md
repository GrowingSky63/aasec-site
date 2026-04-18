# Área Docente Betel — Arquitetura Completa

## Frase conceitual
> "Acompanhar com sensibilidade, registrar com responsabilidade e cuidar com propósito."

---

## 1. Estrutura de Páginas

```
/docente/
  login.html          ← Tela de entrada + seleção de perfil
  dashboard.html      ← Painel geral com gráficos e alertas
  avaliacao.html      ← Preenchimento mensal por criança
  criancas.html       ← Cadastro e listagem de crianças
  familias.html       ← Acompanhamento de famílias
  relatorios.html     ← Relatórios e exportação
  usuarios.html       ← Gestão de usuários (diretora)
  configuracoes.html  ← Configurações do sistema
```

---

## 2. Perfis de Acesso

| Perfil | Acesso |
|--------|--------|
| **Diretora** | Total — todas turmas, gráficos, usuários, configurações |
| **Coordenação** | Todas turmas — revisão pedagógica, sem gestão de usuários |
| **Professora** | Só sua turma — preenche avaliação, consulta histórico |
| **Administrativo** | Cadastros — crianças, famílias, turmas. Sem dados pedagógicos |

---

## 3. Modelo de Banco de Dados

### Tabela: usuarios
```
id, nome, email, senha_hash, perfil (diretora/coordenacao/professora/admin),
turma_id (NULL se não for professora), ativo, criado_em
```

### Tabela: turmas
```
id, nome (Berçário/Maternal I/Maternal II/Jardim I),
professora_id, capacidade, ativo
```

### Tabela: criancas
```
id, nome, data_nascimento, turma_id, foto_url,
observacoes_gerais, ativo, criado_em
```

### Tabela: responsaveis
```
id, crianca_id, nome, parentesco, telefone, whatsapp, email, observacoes
```

### Tabela: avaliacoes_mensais
```
id, crianca_id, mes (YYYY-MM), professora_id,
familia_presente (0/1/2),
crianca_acolhida (0/1/2),
potencial_destaque (0/1/2),
area_destaque (enum),
observacao (text),
criado_em, atualizado_em
```

---

## 4. Fluxo por Perfil

### Professora
1. Login → Avaliação Mensal → seleciona turma
2. Para cada criança: 3 notas + área + observação → Salvar
3. Pode consultar histórico de avaliações anteriores

### Coordenação
1. Login → Dashboard → vê alertas e pendências
2. Pode acessar todas turmas
3. Revisa avaliações, identifica padrões
4. Gera relatório mensal

### Diretora
1. Login → Dashboard completo
2. Vê evolução mês a mês, percentual famílias presentes
3. Identifica crianças em atenção
4. Gerencia usuários e turmas

---

## 5. Os 3 Parâmetros

| # | Nome | Pergunta | 0 | 1 | 2 |
|---|------|----------|---|---|---|
| 1 | Família presente | Pais envolvidos de forma real? | Pouco/nenhum | Irregular | Presente e consistente |
| 2 | Criança acolhida | Segura e vinculada? | Adaptação difícil | Oscilante | Segura e conectada |
| 3 | Potencial em destaque | Qual área se destaca? | Não claro | Em desenvolvimento | Destaque perceptível |

### Áreas de destaque disponíveis
- Linguagem e comunicação
- Socialização
- Coordenação motora
- Música e ritmo
- Artes e criatividade
- Curiosidade e investigação
- Autonomia
- Iniciativa e liderança

---

## 6. Indicadores Estratégicos

- **Meta 2026:** famílias presentes subir de ~50% para 65%
- **Alerta:** criança com nota 0 em 2 meses seguidos
- **Alerta:** família com nota 0 em 3 meses seguidos
- **Destaque:** criança com nota 2 por 3 meses seguidos

---

## 7. Roadmap de Implementação

### Fase 1 — MVP (atual, HTML estático)
- ✅ Login com perfis
- ✅ Dashboard com gráficos
- ✅ Avaliação mensal (3 parâmetros)
- ✅ Lista de crianças por turma
- ✅ Alertas visuais

### Fase 2 — Backend simples (Node.js ou PHP + MySQL)
- Autenticação real com JWT
- Banco de dados persistente
- CRUD completo: crianças, turmas, usuários
- API REST para avaliações
- Exportação PDF/Excel

### Fase 3 — Funcionalidades avançadas
- Histórico com gráficos por criança
- Relatório trimestral automático
- Plano de ação por criança
- Comentários da coordenação
- Notificações para professoras

### Fase 4 — Comunicação
- Módulo de mensagens com famílias
- Agenda digital
- Comunicados

---

## 8. Textos do Sistema

| Elemento | Texto |
|----------|-------|
| Botão salvar | "💾 Salvar avaliação" |
| Botão cancelar | "Cancelar" |
| Sucesso | "✅ Avaliação salva com sucesso!" |
| Pendente | "Preencha para completar o mês" |
| Alerta família | "Família com baixo envolvimento há X meses" |
| Alerta criança | "Criança com sinal de atenção este mês" |
| Campo obs. | "Algum registro importante sobre esta criança este mês..." |
| Login | "Bem-vinda de volta 🌻" |
| Vazio | "Nenhuma avaliação registrada ainda para este mês." |

---

## 9. LGPD e Proteção de Dados

- Dados de crianças = dados sensíveis → acesso restrito por perfil
- Sem compartilhamento externo
- Logs de acesso e modificação
- Senha criptografada (bcrypt)
- Sessão com expiração
- Backup periódico
- Termo de uso para usuários do sistema

---

## 10. Paleta de Cores

| Elemento | Cor |
|----------|-----|
| Verde (identidade) | #4a7c1f |
| Verde claro | #eef5e6 |
| Amarelo (AASEC) | #FFD000 |
| Marrom | #5a3210 |
| Alerta vermelho | #ef4444 |
| Atenção laranja | #f59e0b |
| OK verde | #10b981 |
