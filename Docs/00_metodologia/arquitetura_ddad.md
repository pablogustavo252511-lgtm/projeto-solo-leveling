# Arquitetura DDAD — Padrão Oficial de Desenvolvimento

## Document-Driven AI Development

**Versão:** 3.2 — Pasta de Prompts Promovida para a Raiz da Sessão  
**Autor:** LK Technologies Brasil  
**Metodologia:** DDAD — Document-Driven AI Development  
**Status:** Padrão oficial de desenvolvimento  
**Finalidade:** Documento único para definir a metodologia DDAD, a estrutura da pasta `Docs/`, o fluxo de implementação com IA, o padrão de feedback, auditoria, validação e commits semânticos.

---

# 1. Definição Oficial

DDAD, ou **Document-Driven AI Development**, é uma metodologia de desenvolvimento de software onde a documentação se torna o principal artefato do projeto.

A documentação guia:

- a visão do produto;
- a arquitetura;
- o planejamento;
- a geração de prompts;
- a implementação assistida por IA;
- a auditoria contínua;
- a validação incremental;
- a rastreabilidade das decisões;
- a evolução controlada do sistema;
- o versionamento por commits semânticos.

O princípio central da DDAD é:

> A documentação é a fonte única da verdade do projeto.

Na DDAD, o desenvolvimento não começa pelo código. Ele começa pela documentação.

O código é consequência da documentação.

---

# 2. Objetivo deste Documento

Este documento define o padrão oficial da LK Technologies Brasil para organizar, planejar, executar, auditar e evoluir projetos com apoio de IA.

Ele deve ser usado como referência para:

- novos projetos;
- monorepos;
- sistemas web;
- APIs;
- landing pages;
- sistemas internos;
- SaaS;
- refatorações;
- organização da pasta `Docs/`;
- planejamento de sessões;
- divisão de blocos;
- criação de prompts;
- auditoria de feedbacks;
- validação de entregas;
- onboarding de novos desenvolvedores;
- execução com agentes de IA, como Claude Code, ChatGPT, Copilot ou similares.

---

# 3. Problema que a DDAD Resolve

Fluxos comuns de desenvolvimento com IA normalmente seguem este modelo:

```txt
Prompt
↓
Código
```

Esse modelo tende a gerar problemas como:

- perda de contexto;
- decisões técnicas inconsistentes;
- retrabalho;
- falta de rastreabilidade;
- dificuldade de manutenção;
- dificuldade de onboarding;
- dívida técnica acumulada;
- dependência excessiva da memória da IA;
- código implementado sem relação clara com decisões anteriores;
- alterações sem auditoria;
- commits sem histórico de decisão;
- dificuldade para continuar projetos em sessões futuras.

A DDAD resolve esse problema invertendo a lógica:

```txt
Documento
↓
Prompt
↓
Implementação
↓
Feedback
↓
Auditoria
↓
Validação
↓
Commit
↓
Próximo bloco
```

---

# 4. Princípios Fundamentais da DDAD

## 4.1 Documentação Primeiro

Nenhuma implementação deve começar sem documentação.

Toda funcionalidade, ajuste, refatoração, correção ou decisão técnica deve nascer em um documento.

A documentação deve responder:

- o que será feito;
- por que será feito;
- onde será feito;
- quais arquivos podem ser alterados;
- quais arquivos não devem ser alterados;
- quais critérios definem que a entrega foi concluída;
- quais riscos devem ser observados.

---

## 4.2 Arquitetura Primeiro

Antes da implementação, deve existir uma base arquitetural clara.

Essa base deve definir:

- estrutura do projeto;
- stack técnica;
- padrões de código;
- organização de pastas;
- contratos técnicos;
- dependências;
- regras de frontend;
- regras de backend;
- regras de banco de dados;
- regras de deploy;
- regras de segurança;
- regras de versionamento.

A IA não deve decidir a arquitetura principal do projeto sozinha. Ela deve seguir a arquitetura documentada.

---

## 4.3 IA como Executor

Na DDAD, a IA atua como executor técnico.

Ela pode:

- implementar;
- refatorar;
- organizar arquivos;
- corrigir bugs;
- gerar feedbacks;
- validar critérios de aceite;
- sugerir melhorias;
- auditar arquivos;
- encontrar inconsistências.

Mas ela não deve substituir a decisão arquitetural do projeto sem autorização.

A IA deve executar o que foi previamente documentado.

---

## 4.4 Auditoria Contínua

Toda implementação precisa ser auditada.

Nenhum bloco deve ser considerado concluído apenas porque o código foi gerado.

A conclusão depende de:

- feedback gerado;
- arquivos alterados revisados;
- critérios de aceite validados;
- riscos identificados;
- testes ou validações executadas;
- aprovação do responsável.

O ciclo correto é:

```txt
Implementação
↓
Feedback
↓
Análise humana
↓
Correção, se necessário
↓
Validação
↓
Commit
```

---

## 4.5 Evolução Incremental

Projetos grandes devem ser quebrados em sessões, blocos e prompts menores.

Isso reduz risco, melhora o controle e facilita a continuidade.

Cada bloco deve conter:

- objetivo;
- contexto;
- escopo;
- fora de escopo;
- arquivos envolvidos;
- critérios de aceite;
- validações esperadas;
- feedback obrigatório;
- commit semântico sugerido.

---

# 5. Regras Fundamentais

Na DDAD:

- nenhum bloco começa sem documento;
- nenhum bloco termina sem feedback;
- nenhum feedback aprovado fica sem commit;
- nenhuma decisão arquitetural relevante deve ficar apenas no chat;
- nenhuma implementação deve depender exclusivamente da memória da IA;
- nenhum próximo bloco deve começar antes da validação do bloco atual;
- toda alteração relevante de comportamento deve atualizar a documentação correspondente.

Regra central:

```txt
Mudou comportamento relevante?
↓
Atualize a documentação.
```

---

# 6. Fluxo Oficial DDAD

O fluxo completo da DDAD é:

```txt
Visão do Produto
↓
Arquitetura
↓
Documentação Base
↓
Planejamento
↓
Divisão em Sessões
↓
Divisão em Blocos
↓
Geração de Prompts
↓
Implementação pela IA
↓
Feedback Técnico
↓
Auditoria
↓
Correção, se necessário
↓
Validação
↓
Commit Semântico
↓
Próximo Bloco
```

---

# 7. Etapas da DDAD

## 7.1 Etapa 1 — Visão do Produto

Define a base conceitual do projeto.

Deve conter:

- problema;
- solução;
- público-alvo;
- proposta de valor;
- objetivos do produto;
- regras de negócio principais;
- limites de escopo;
- visão de futuro.

Documentos recomendados:

```txt
visao_produto.md
proposta_solucao.md
publico_alvo.md
regras_negocio.md
roadmap.md
```

---

## 7.2 Etapa 2 — Arquitetura Base

Define a estrutura técnica do projeto.

Deve conter:

- frontend;
- backend;
- banco de dados;
- infraestrutura;
- autenticação;
- permissões;
- deploy;
- integrações;
- contratos técnicos;
- padrões de pastas;
- decisões arquiteturais.

Documentos recomendados:

```txt
arquitetura_base.md
stack_tecnica.md
estrutura_pastas.md
padroes_codigo.md
decisoes_arquiteturais.md
```

---

## 7.3 Etapa 3 — Planejamento

Define como o projeto será executado.

Deve conter:

- divisão por sessões;
- divisão por blocos;
- ordem de implementação;
- dependências entre blocos;
- riscos;
- prioridades;
- critérios de conclusão.

Documentos recomendados:

```txt
divisao_etapas.md
plano_implementacao_geral.md
checklist_desenvolvimento.md
fluxo_ddad.md
```

---

## 7.4 Etapa 4 — Quebra em Blocos

Cada sessão deve ser dividida em blocos menores.

Exemplo:

```txt
bloco_00_setup_base.md
bloco_01_autenticacao.md
bloco_02_dashboard.md
bloco_03_usuarios.md
bloco_04_deploy.md
```

Cada bloco deve conter:

- objetivo;
- contexto;
- escopo permitido;
- escopo proibido;
- arquivos que podem ser alterados;
- arquivos que não podem ser alterados;
- critérios de aceite;
- comandos de validação;
- feedback obrigatório;
- commit semântico sugerido.

---

## 7.5 Etapa 5 — Geração de Prompt

O documento do bloco é transformado em um prompt estruturado para a IA executora.

Fluxo:

```txt
bloco_x.md
↓
prompt_bloco_x.md
↓
implementação
```

O prompt precisa ser claro, objetivo e restritivo.

Ele deve orientar a IA sobre:

- o que fazer;
- o que não fazer;
- quais arquivos alterar;
- quais padrões seguir;
- qual feedback gerar;
- qual commit sugerir.

---

## 7.6 Etapa 6 — Implementação pela IA

A IA executa o bloco com base no prompt.

Resultado esperado:

- código implementado;
- estrutura respeitada;
- documentação atualizada, se necessário;
- erros tratados;
- critérios de aceite atendidos;
- testes ou validações executadas;
- feedback gerado.

A IA não deve alterar escopo sem autorização.

---

## 7.7 Etapa 7 — Feedback Técnico

Ao finalizar qualquer bloco, deve ser gerado um feedback em Markdown.

Nome recomendado:

```txt
feedback_bloco_00_setup_base.md
feedback_bloco_01_autenticacao.md
feedback_bloco_02_dashboard.md
```

O feedback deve conter:

- resumo da implementação;
- arquivos criados;
- arquivos alterados;
- arquivos removidos, se houver;
- dependências adicionadas;
- decisões tomadas;
- problemas encontrados;
- pendências;
- riscos restantes;
- validações executadas;
- testes realizados;
- resultado do `git status`;
- confirmação se houve ou não commit;
- commit semântico sugerido.

---

## 7.8 Etapa 8 — Auditoria

O feedback deve ser analisado antes do próximo bloco.

A auditoria deve verificar:

- o objetivo foi cumprido?
- o escopo foi respeitado?
- a arquitetura foi preservada?
- o código introduziu risco?
- a documentação foi atualizada?
- há pendências?
- o sistema ainda roda?
- o próximo bloco pode iniciar?

Se houver problemas, cria-se um prompt corretivo.

---

## 7.9 Etapa 9 — Correções

Caso existam pendências, bugs ou inconsistências, deve ser criado um bloco corretivo ou prompt de ajuste.

Correções devem seguir o mesmo fluxo:

```txt
Análise
↓
Prompt corretivo
↓
Implementação
↓
Feedback
↓
Auditoria
↓
Validação
↓
Commit
```

---

## 7.10 Etapa 10 — Commit Semântico

Após aprovação do bloco, deve ser realizado commit semântico.

Formato:

```txt
tipo(escopo): descrição
```

Exemplos:

```txt
feat(frontend): implementa dashboard administrativo
fix(api): corrige validação de autenticação
docs(ddad): adiciona metodologia oficial de desenvolvimento
refactor(host): reorganiza scripts de orquestração
chore(deploy): ajusta configuração de produção
```

Regra:

> O commit deve representar exatamente o que foi aprovado no bloco.

---

## 7.11 Etapa 11 — Próximo Bloco

Somente após a validação e o commit do bloco atual, o próximo bloco deve ser iniciado.

Regra oficial:

```txt
Bloco atual aprovado
↓
Commit realizado
↓
Próximo bloco liberado
```

---

# 8. Estrutura Oficial da Pasta Docs

A estrutura oficial da pasta `Docs/` para projetos da LK Technologies Brasil é:

```txt
Docs/
├── 00_metodologia/
├── 01_arquitetura/
├── 02_produto/
├── 03_desenvolvimento/
├── 04_analises/
├── 05_implementacoes/
├── 06_sessoes/
├── 07_feedbacks/
├── 08_deploy/
├── 09_governanca/
├── 10_referencias/
└── 99_arquivo_morto/
```

---

# 9. Estrutura Completa Recomendada

```txt
Docs/
├── 00_metodologia/
│   └── arquitetura_ddad.md
│
├── 01_arquitetura/
│   ├── arquitetura_base.md
│   ├── stack_tecnica.md
│   ├── estrutura_pastas.md
│   ├── padroes_codigo.md
│   ├── padroes_rotas.md
│   ├── padroes_banco_dados.md
│   ├── padroes_frontend.md
│   ├── padroes_backend.md
│   └── decisoes_arquiteturais.md
│
├── 02_produto/
│   ├── visao_produto.md
│   ├── proposta_solucao.md
│   ├── publico_alvo.md
│   ├── regras_negocio.md
│   ├── funcionalidades.md
│   └── roadmap.md
│
├── 03_desenvolvimento/
│   ├── fluxo_ddad.md
│   ├── divisao_etapas.md
│   ├── plano_implementacao_geral.md
│   ├── checklist_desenvolvimento.md
│   └── comandos_padrao.md
│
├── 04_analises/
│   ├── analise_coerencia_geral.md
│   ├── analise_riscos.md
│   ├── analise_performance.md
│   ├── analise_seguranca.md
│   ├── analise_layout.md
│   └── analise_pendencias.md
│
├── 05_implementacoes/
│   ├── bloco_00_setup_base.md
│   ├── bloco_01_autenticacao.md
│   ├── bloco_02_dashboard.md
│   ├── bloco_03_usuarios.md
│   └── pendencias/
│       ├── pendencias_p1.md
│       ├── pendencias_p2.md
│       ├── pendencias_p3.md
│       └── pendencias_p4.md
│
├── 06_sessoes/
│   ├── sessao_01_implementacao_inicial/
│   │   ├── 01_analises/
│   │   ├── 02_planejamento/
│   │   │   └── blocos/
│   │   ├── 03_bugs/
│   │   ├── 04_feedback/
│   │   ├── 05_validacao/
│   │   ├── 06_prompts/
│   │   └── README.md
│   │
│   └── sessao_02_refatoracao_landing_page/
│       ├── 01_analises/
│       ├── 02_planejamento/
│       │   └── blocos/
│       ├── 03_bugs/
│       ├── 04_feedback/
│       ├── 05_validacao/
│       ├── 06_prompts/
│       └── README.md
│
├── 07_feedbacks/
│   ├── feedback_bloco_00_setup_base.md
│   ├── feedback_bloco_01_autenticacao.md
│   └── feedback_pendencias.md
│
├── 08_deploy/
│   ├── deploy_local.md
│   ├── deploy_producao.md
│   ├── render_config.md
│   ├── variaveis_ambiente.md
│   ├── dominio_dns.md
│   ├── rollback.md
│   ├── checklist_producao.md
│   └── troubleshooting.md
│
├── 09_governanca/
│   ├── convencoes_codigo.md
│   ├── convencoes_commits.md
│   ├── padrao_feedback.md
│   ├── regras_ia.md
│   ├── riscos_tecnicos.md
│   ├── glossario.md
│   └── changelog.md
│
├── 10_referencias/
│   ├── links.md
│   ├── imagens/
│   ├── prints/
│   ├── exemplos/
│   └── materiais_cliente/
│
└── 99_arquivo_morto/
    ├── README.md
    └── pendente_classificacao/
```

---

# 10. Função de Cada Pasta

## 10.1 `00_metodologia/`

Guarda a metodologia oficial usada no projeto.

Conteúdo principal:

```txt
arquitetura_ddad.md
```

Essa pasta responde:

- qual metodologia o projeto segue;
- quais são as regras de desenvolvimento;
- qual é o ciclo de execução;
- como a documentação deve ser usada.

---

## 10.2 `01_arquitetura/`

Guarda a base técnica do projeto.

Essa pasta responde:

- como o sistema funciona tecnicamente;
- qual stack será usada;
- como as pastas são organizadas;
- quais padrões não podem ser quebrados;
- quais decisões arquiteturais foram tomadas.

---

## 10.3 `02_produto/`

Guarda a visão de produto e regras de negócio.

Essa pasta responde:

- o que estamos construindo;
- para quem;
- qual problema resolve;
- quais funcionalidades existem;
- quais regras de negócio precisam ser respeitadas.

---

## 10.4 `03_desenvolvimento/`

Guarda o planejamento geral de desenvolvimento.

Essa pasta responde:

- como o projeto será desenvolvido;
- qual a sequência;
- quais etapas existem;
- qual o fluxo oficial;
- quais comandos são usados.

---

## 10.5 `04_analises/`

Guarda análises técnicas, auditorias e diagnósticos.

Essa pasta responde:

- quais problemas foram encontrados;
- o sistema está coerente;
- existem riscos;
- existem pendências;
- há problemas de layout, segurança ou performance.

---

## 10.6 `05_implementacoes/`

Guarda os planos de implementação por bloco.

Essa pasta responde:

- o que a IA deve implementar;
- qual o escopo do bloco;
- quais critérios de aceite;
- quais pendências serão tratadas.

---

## 10.7 `06_sessoes/`

Guarda as sessões de desenvolvimento.

Sessão é uma rodada organizada de trabalho, geralmente composta por vários blocos relacionados.

Essa pasta responde:

- qual foi o objetivo desta rodada de trabalho;
- quais blocos pertencem à sessão;
- quais prompts foram usados;
- quais bugs foram encontrados;
- quais feedbacks foram gerados;
- quais validações foram feitas;
- quais pendências ficaram.

Estrutura padrão de cada sessão:

```txt
sessao_xx_nome_da_sessao/
├── 01_analises/
├── 02_planejamento/
│   └── blocos/
├── 03_bugs/
├── 04_feedback/
├── 05_validacao/
├── 06_prompts/
└── README.md
```

---

## 10.8 `07_feedbacks/`

Guarda feedbacks gerais ou feedbacks fora de uma sessão específica.

Observação:

- feedbacks de blocos dentro de uma sessão devem ficar em `Docs/06_sessoes/sessao_xx_nome/04_feedback/`;
- feedbacks globais, feedbacks de migração, auditorias externas ou retornos gerais podem ficar em `Docs/07_feedbacks/`.

---

## 10.9 `08_deploy/`

Guarda tudo relacionado a publicação, ambiente e produção.

Essa pasta responde:

- como rodar localmente;
- como publicar;
- como configurar domínio;
- quais variáveis existem;
- como fazer rollback;
- como resolver erros comuns.

---

## 10.10 `09_governanca/`

Guarda as regras oficiais do projeto.

Essa pasta responde:

- quais são as regras técnicas;
- como commitar;
- como nomear arquivos;
- como a IA deve agir;
- quais riscos técnicos precisam ser monitorados;
- o que cada termo significa.

---

## 10.11 `10_referencias/`

Guarda materiais auxiliares.

Essa pasta responde:

- quais materiais apoiam o projeto;
- quais prints, imagens, referências ou links são usados como base.

---

## 10.12 `99_arquivo_morto/`

Guarda arquivos antigos, duplicados ou pendentes de classificação.

Regras:

- não apagar documentos sem necessidade;
- mover documentos duvidosos para `pendente_classificacao/`;
- registrar no README o motivo da movimentação;
- não usar arquivos dessa pasta como fonte oficial da verdade sem revisão.

---

# 11. Estrutura Interna Padrão de Cada Sessão

Na DDAD da LK Technologies Brasil, **toda implementação relevante deve ser organizada como uma sessão** dentro de:

```txt
Docs/06_sessoes/
```

Uma sessão representa uma fase prática de desenvolvimento do projeto.

Cada sessão pode representar:

- uma nova feature;
- uma refatoração importante;
- uma correção estrutural;
- uma padronização de arquitetura;
- uma melhoria visual relevante;
- uma etapa de deploy;
- uma correção de bugs agrupada;
- uma evolução de produto.

Regra oficial:

```txt
Nova implementação relevante
↓
Nova sessão em Docs/06_sessoes/
```

Exemplos:

```txt
sessao_01_implementacao_inicial
sessao_02_refatoracao_landing_page
sessao_03_orquestracao_monorepo
sessao_04_deploy_render
sessao_05_modulo_usuarios
sessao_06_correcao_bugs_autenticacao
```

Toda sessão dentro de `Docs/06_sessoes/` deve seguir este padrão:

```txt
sessao_xx_nome_da_sessao/
├── 01_analises/
│   ├── analise_coerencia.md
│   ├── analise_arquitetural.md
│   ├── analise_riscos.md
│   └── analise_pendencias.md
│
├── 02_planejamento/
│   └── blocos/
│       ├── bloco_00_nome_do_bloco.md
│       ├── bloco_01_nome_do_bloco.md
│       └── bloco_02_nome_do_bloco.md
│
├── 03_bugs/
│   ├── bugs_pendentes.md
│   ├── bugs_corrigidos.md
│   └── bug_01_nome_do_bug.md
│
├── 04_feedback/
│   ├── feedback_bloco_00_nome_do_bloco.md
│   ├── feedback_bloco_01_nome_do_bloco.md
│   └── feedback_bloco_02_nome_do_bloco.md
│
├── 05_validacao/
│   ├── validacao_bloco_00_nome_do_bloco.md
│   ├── validacao_bloco_01_nome_do_bloco.md
│   ├── pendencias_sessao.md
│   ├── validacao_final_sessao.md
│   └── fechamento_sessao.md
│
├── 06_prompts/
│   ├── prompt_bloco_00_nome_do_bloco.md
│   ├── prompt_bloco_01_nome_do_bloco.md
│   └── prompt_bloco_02_nome_do_bloco.md
│
└── README.md
```

Observação oficial:

- Feedbacks de blocos pertencentes a uma sessão devem ficar em `Docs/06_sessoes/sessao_xx_nome/04_feedback/`.
- Feedbacks globais, feedbacks de migração, auditorias externas ou retornos que não pertencem a uma sessão específica podem ficar em `Docs/07_feedbacks/`.
- Bugs encontrados durante uma sessão devem ficar dentro da própria sessão, em `03_bugs/`.
- O planejamento executável da sessão deve ficar em `02_planejamento/`.
- Os documentos de blocos devem ficar em `02_planejamento/blocos/`.
- Os prompts usados pela IA devem ficar em `06_prompts/`, na raiz da sessão — pasta irmã de `02_planejamento/`, e não mais uma subpasta dele.

---

# 12. Função de Cada Pasta Dentro da Sessão

## 12.1 `01_analises/`

Armazena análises feitas antes ou durante a implementação.

Pode conter:

- análise de coerência;
- análise arquitetural;
- análise de riscos;
- análise de pendências;
- análise de layout;
- análise de segurança;
- análise de performance;
- análise de impacto técnico.

Essa pasta responde:

- o que foi analisado;
- quais problemas foram encontrados;
- quais riscos existem;
- quais decisões precisam ser tomadas antes da implementação;
- se a sessão pode avançar para planejamento ou implementação.

Exemplos:

```txt
analise_coerencia.md
analise_arquitetural.md
analise_riscos.md
analise_layout.md
analise_pendencias.md
```

---

## 12.2 `02_planejamento/`

Armazena o planejamento executável da sessão.

Essa pasta deve conter uma subpasta principal:

```txt
02_planejamento/
└── blocos/
```

### `blocos/`

Contém os documentos de planejamento de cada bloco.

Cada bloco deve explicar:

- objetivo;
- contexto;
- escopo permitido;
- escopo proibido;
- arquivos envolvidos;
- tarefas obrigatórias;
- critérios de aceite;
- validações esperadas;
- feedback obrigatório;
- commit semântico sugerido.

Exemplos:

```txt
bloco_00_analise_inicial.md
bloco_01_estrutura_base.md
bloco_02_ajuste_rotas.md
bloco_03_validacao_final.md
```

Regra oficial:

```txt
Todo bloco deve ter um documento de planejamento.
```

> Os prompts derivados de cada bloco **não** ficam mais dentro de
> `02_planejamento/` — eles têm pasta própria na raiz da sessão, em
> `06_prompts/` (ver seção 12.6).

---

## 12.3 `03_bugs/`

Armazena bugs encontrados durante a sessão.

Essa pasta deve registrar:

- bugs encontrados;
- impacto técnico ou visual;
- prioridade;
- status;
- ação recomendada;
- relação com bloco ou feedback, quando existir.

Exemplos:

```txt
bug_01_erro_login.md
bug_02_layout_mobile.md
bug_03_proxy_api.md
bugs_pendentes.md
bugs_corrigidos.md
```

Classificação recomendada:

```txt
P1 — Crítico
P2 — Importante
P3 — Melhoria recomendada
P4 — Opcional
```

Regra:

```txt
Bug encontrado durante uma sessão deve ser documentado dentro da própria sessão.
```

---

## 12.4 `04_feedback/`

Armazena os feedbacks gerados após cada bloco implementado.

Essa pasta é obrigatória para rastreabilidade.

Exemplos:

```txt
feedback_bloco_00_analise_inicial.md
feedback_bloco_01_estrutura_base.md
feedback_bloco_02_ajuste_rotas.md
feedback_bloco_03_validacao_final.md
```

Regra oficial:

```txt
Nenhum bloco termina sem feedback.
```

O feedback deve conter:

- resumo da implementação;
- arquivos criados;
- arquivos alterados;
- arquivos removidos, se houver;
- dependências adicionadas, se houver;
- decisões técnicas tomadas;
- problemas encontrados;
- pendências;
- validações executadas;
- resultado do `git status`;
- commit semântico sugerido;
- confirmação se houve ou não commit.

---

## 12.5 `05_validacao/`

Armazena documentos de validação, pendências e fechamento.

Pode conter:

```txt
validacao_bloco_00_nome_do_bloco.md
validacao_bloco_01_nome_do_bloco.md
pendencias_sessao.md
validacao_final_sessao.md
fechamento_sessao.md
```

Essa pasta responde:

- o bloco foi aprovado?
- existem pendências?
- quais pendências são P1, P2, P3 ou P4?
- a sessão pode ser encerrada?
- o próximo bloco ou próxima sessão está liberado?

Regra:

```txt
Nenhuma sessão deve ser considerada concluída sem validação ou fechamento.
```

---

## 12.6 `06_prompts/`

Armazena os prompts enviados para a IA executora — pasta irmã de
`02_planejamento/`, `03_bugs/`, `04_feedback/` e `05_validacao/` na raiz da
sessão (não é mais subpasta de `02_planejamento/`).

Todo prompt deve nascer a partir do documento do bloco correspondente, em
`02_planejamento/blocos/`.

Exemplos:

```txt
prompt_bloco_00_analise_inicial.md
prompt_bloco_01_estrutura_base.md
prompt_bloco_02_ajuste_rotas.md
```

Essa pasta responde:

- quais prompts foram efetivamente enviados para a IA executora;
- de qual bloco cada prompt se originou;
- qual foi a instrução exata usada em cada etapa da implementação.

Regra oficial:

```txt
Todo bloco deve ter um documento de planejamento.
Todo prompt deve nascer a partir do documento do bloco correspondente.
Todo prompt deve ficar em 06_prompts/, na raiz da sessão.
```

---

## 12.7 `README.md`

Cada sessão deve conter um `README.md` explicando:

- objetivo da sessão;
- contexto da implementação;
- escopo geral;
- blocos previstos;
- status atual;
- links para análises, blocos, bugs, feedbacks e validações.

Modelo recomendado:

```md
# Sessão XX — Nome da Sessão

## Objetivo

Descrever o objetivo principal da sessão.

## Contexto

Explicar por que esta sessão existe.

## Escopo

Listar o que será tratado nesta sessão.

## Blocos

- [ ] Bloco 00 — Nome
- [ ] Bloco 01 — Nome
- [ ] Bloco 02 — Nome

## Status

- [ ] Em planejamento
- [ ] Em implementação
- [ ] Em validação
- [ ] Concluída

## Observações

Registrar observações relevantes.
```

---

## 12.8 Diferença Entre Sessão, Bloco, Bug, Feedback e Validação

## Sessão

Uma sessão é uma fase maior de desenvolvimento.

Exemplo:

```txt
sessao_02_refatoracao_landing_page
```

## Bloco

Um bloco é uma parte executável dentro da sessão.

Exemplo:

```txt
bloco_01_ajuste_header_sidebar.md
```

## Bug

Um bug é um problema encontrado durante a sessão.

Exemplo:

```txt
bug_01_erro_proxy_vaultify.md
```

## Feedback

Um feedback é o relatório gerado após a implementação de um bloco.

Exemplo:

```txt
feedback_bloco_01_ajuste_header_sidebar.md
```

## Validação

Uma validação é o documento que aprova, reprova ou libera o próximo bloco.

Exemplo:

```txt
validacao_bloco_01_ajuste_header_sidebar.md
```

Regra final:

```txt
Sessão organiza a implementação.
Bloco define o que será executado.
Bug registra problema encontrado.
Feedback registra o que foi feito.
Validação decide se pode avançar.
```

---

# 13. Padrão de Nomenclatura

A DDAD deve usar nomes previsíveis, limpos e fáceis de serem interpretados por pessoas e IA.

## 13.1 Regras Obrigatórias

Usar sempre:

```txt
snake_case
sem acentos
sem espaços
com numeração quando houver ordem lógica
```

Evitar:

```txt
Sessão 3 Segurança
Feedback análises
Levantamento Informações
Plan
Nova pasta
Documento final final 2
```

Usar:

```txt
sessao_03_seguranca
feedback_bloco_01_autenticacao
01_levantamento
03_planejamento
arquitetura_base.md
```

---

## 13.2 Padrão Para Sessões

```txt
sessao_01_implementacao_inicial
sessao_02_padronizacao_projetos
sessao_03_seguranca
sessao_04_refatoracao_layout
sessao_05_deploy_producao
```

---

## 13.3 Padrão Para Blocos

```txt
bloco_00_nome_do_bloco.md
bloco_01_nome_do_bloco.md
bloco_02_nome_do_bloco.md
```

Exemplos:

```txt
bloco_00_setup_base.md
bloco_01_autenticacao.md
bloco_02_dashboard_admin.md
```

---

## 13.4 Padrão Para Prompts

```txt
prompt_bloco_00_nome_do_bloco.md
prompt_bloco_01_nome_do_bloco.md
prompt_bloco_02_nome_do_bloco.md
```

---

## 13.5 Padrão Para Feedbacks

```txt
feedback_bloco_00_nome_do_bloco.md
feedback_bloco_01_nome_do_bloco.md
feedback_bloco_02_nome_do_bloco.md
```

---

## 13.6 Padrão Para Validações

```txt
validacao_bloco_00_nome_do_bloco.md
validacao_bloco_01_nome_do_bloco.md
pendencias_sessao.md
fechamento_sessao.md
```

---

# 14. Modelo Padrão de Bloco de Implementação

Todo bloco deve seguir este modelo:

```md
# Bloco XX — Nome do Bloco

## 1. Objetivo

Descrever o objetivo principal do bloco.

---

## 2. Contexto

Explicar por que este bloco existe e qual problema ele resolve.

---

## 3. Escopo Permitido

Listar o que deve ser feito.

---

## 4. Escopo Proibido

Listar o que não deve ser alterado neste bloco.

---

## 5. Arquivos Envolvidos

Listar arquivos e pastas que podem ser criados, alterados ou consultados.

---

## 6. Tarefas Obrigatórias

- [ ] Tarefa 1
- [ ] Tarefa 2
- [ ] Tarefa 3

---

## 7. Critérios de Aceite

O bloco só será considerado concluído se:

- [ ] critério 1;
- [ ] critério 2;
- [ ] critério 3.

---

## 8. Validações Esperadas

Listar validações técnicas, visuais, funcionais ou arquiteturais.

---

## 9. Feedback Obrigatório

Ao final da implementação, gerar feedback contendo:

- resumo;
- arquivos criados;
- arquivos alterados;
- arquivos removidos;
- decisões tomadas;
- problemas encontrados;
- pendências;
- validações executadas;
- resultado do git status.

---

## 10. Commit Semântico Sugerido

`tipo(escopo): descrição objetiva`
```

---

# 15. Modelo Padrão de Prompt DDAD

Todo prompt enviado para a IA executora deve seguir este modelo:

```md
Você é o executor técnico do projeto seguindo a metodologia DDAD — Document-Driven AI Development.

## Objetivo

Descrever o objetivo da implementação.

## Contexto

Explicar o contexto do projeto e da sessão atual.

## Escopo Permitido

Implementar apenas o que está descrito neste prompt.

## Escopo Proibido

Não alterar pontos fora do escopo sem autorização.

## Regras Obrigatórias

1. Respeitar a arquitetura existente.
2. Não alterar arquivos fora do escopo sem necessidade.
3. Não remover funcionalidades existentes.
4. Usar os padrões definidos na documentação.
5. Seguir a estrutura de pastas do projeto.
6. Não expor secrets.
7. Não alterar `.env` sem autorização.
8. Gerar feedback ao final.
9. Sugerir commit semântico.
10. Não realizar commit se o prompt pedir explicitamente para não commitar.

## Tarefas

1. Tarefa 1.
2. Tarefa 2.
3. Tarefa 3.

## Critérios de Aceite

A implementação será considerada concluída se:

- critério 1;
- critério 2;
- critério 3.

## Feedback Final Obrigatório

Gerar o arquivo:

`Docs/06_sessoes/sessao_xx_nome/04_feedback/feedback_bloco_xx_nome.md`

O feedback deve conter:

- arquivos criados;
- arquivos alterados;
- arquivos removidos;
- decisões tomadas;
- problemas encontrados;
- pendências;
- validações executadas;
- resultado do git status;
- commit semântico sugerido.
```

---

# 16. Modelo Padrão de Feedback DDAD

Todo feedback gerado após uma implementação deve seguir este modelo:

```md
# Feedback — Bloco XX: Nome do Bloco

## 1. Resumo da Implementação

Descrever o que foi implementado.

---

## 2. Arquivos Criados

- arquivo_1
- arquivo_2

---

## 3. Arquivos Alterados

- arquivo_1
- arquivo_2

---

## 4. Arquivos Removidos

- arquivo_1
- arquivo_2

Caso nenhum arquivo tenha sido removido, registrar:

Nenhum arquivo removido.

---

## 5. Dependências Adicionadas

- dependência_1
- dependência_2

Caso nenhuma dependência tenha sido adicionada, registrar:

Nenhuma dependência adicionada.

---

## 6. Decisões Técnicas Tomadas

- decisão 1;
- decisão 2.

---

## 7. Problemas Encontrados

- problema 1;
- problema 2.

Caso nenhum problema tenha sido encontrado, registrar:

Nenhum problema encontrado.

---

## 8. Pendências

Classificar pendências como:

- P1: crítica;
- P2: importante;
- P3: melhoria recomendada;
- P4: opcional.

---

## 9. Validações Executadas

- validação 1;
- validação 2.

---

## 10. Resultado do Git Status

```txt
colar resultado do git status aqui
```

---

## 11. Resultado Final

Informar se o bloco foi concluído, parcialmente concluído ou bloqueado.

---

## 12. Commit Semântico Sugerido

`tipo(escopo): descrição objetiva`
```

---

# 17. Modelo Padrão de Validação DDAD

A validação deve confirmar se o bloco realmente está pronto.

Modelo recomendado:

```md
# Validação — Bloco XX: Nome do Bloco

## 1. Status

- [ ] Aprovado
- [ ] Aprovado com ressalvas
- [ ] Reprovado
- [ ] Bloqueado

---

## 2. Critérios de Aceite

- [ ] Critério 1 atendido
- [ ] Critério 2 atendido
- [ ] Critério 3 atendido

---

## 3. Pendências

| Prioridade | Descrição | Impacto | Ação Recomendada |
|-----------|-----------|---------|------------------|
| P1 | | | |
| P2 | | | |
| P3 | | | |
| P4 | | | |

---

## 4. Observações

Registrar observações técnicas, visuais ou arquiteturais.

---

## 5. Decisão

Informar se o próximo bloco está liberado ou se existe correção obrigatória antes.
```

---

# 18. Classificação de Pendências

As pendências devem ser classificadas por prioridade.

## P1 — Crítica

Bloqueia a continuidade.

Exemplos:

- aplicação não roda;
- build quebrado;
- erro de autenticação;
- falha grave de segurança;
- perda de dados;
- fluxo principal inutilizável.

## P2 — Importante

Não bloqueia totalmente, mas deve ser corrigida antes do fechamento da sessão.

Exemplos:

- comportamento incompleto;
- layout quebrado em tela importante;
- regra de negócio parcialmente implementada;
- inconsistência de contrato técnico.

## P3 — Melhoria Recomendada

Não impede o uso, mas melhora qualidade, manutenção ou experiência.

Exemplos:

- refatoração;
- melhoria de responsividade;
- ajuste visual;
- organização de código;
- melhoria de feedback ao usuário.

## P4 — Opcional

Ajuste fino ou refinamento futuro.

Exemplos:

- microinteração;
- animação;
- melhoria estética;
- documentação complementar;
- otimização pequena.

---

# 19. Commit Semântico

A DDAD recomenda commits semânticos por bloco.

Formato:

```txt
tipo(escopo): descrição
```

Tipos recomendados:

```txt
feat      nova funcionalidade
fix       correção de bug
docs      documentação
style     ajuste visual sem mudança de lógica
refactor  refatoração
test      testes
chore     tarefas técnicas
perf      performance
build     build/dependências
ci        integração contínua
```

Exemplos:

```txt
docs(ddad): padroniza estrutura da pasta Docs
feat(frontend): implementa dashboard inicial
fix(auth): corrige validação de sessão
refactor(api): reorganiza camada de serviços
style(ui): ajusta espaçamento do header
chore(project): remove arquivos obsoletos
```

---

# 20. Regras Para IA Executora

Toda IA executora deve seguir estas regras:

1. Não decidir arquitetura fora da documentação.
2. Não alterar escopo sem autorização.
3. Não apagar arquivos sem justificar.
4. Não criar estrutura paralela sem necessidade.
5. Não misturar sessões diferentes.
6. Não implementar próximo bloco antes da validação do bloco atual.
7. Gerar feedback após cada bloco.
8. Sugerir commit semântico após cada bloco.
9. Registrar pendências quando existirem.
10. Respeitar os padrões de nomenclatura.
11. Respeitar a estrutura oficial da pasta `Docs/`.
12. Atualizar documentação quando a implementação mudar comportamento relevante.
13. Não expor secrets.
14. Não alterar `.env` sem autorização.
15. Não realizar commit quando o prompt solicitar explicitamente que não realize.

---

# 21. Regras de Auditoria

Após cada feedback, o responsável deve validar:

```txt
1. O objetivo foi cumprido?
2. O escopo foi respeitado?
3. A arquitetura foi preservada?
4. O código compila?
5. O sistema roda?
6. As rotas principais funcionam?
7. A documentação foi atualizada?
8. Há pendências?
9. O commit é permitido?
10. O próximo bloco pode iniciar?
```

Caso uma resposta seja negativa, deve ser gerado prompt corretivo.

---

# 22. Regras de Evolução da Documentação

A documentação deve evoluir junto com o projeto.

Sempre que houver mudança em:

- arquitetura;
- stack;
- regras de negócio;
- contratos técnicos;
- fluxos;
- deploy;
- permissões;
- estrutura de pastas;
- identidade visual;
- decisões técnicas;

a documentação correspondente deve ser atualizada.

Regra oficial:

```txt
Mudou comportamento relevante?
↓
Atualize a documentação.
```

---

# 23. Quando Criar Uma Nova Sessão

Criar uma nova sessão quando o trabalho representar uma fase maior do projeto.

Exemplos:

```txt
sessao_01_implementacao_inicial
sessao_02_padronizacao_projetos
sessao_03_seguranca
sessao_04_refatoracao_interface
sessao_05_deploy_producao
sessao_06_performance_acessibilidade
```

Uma sessão deve ter início, meio e fim.

Toda sessão deve possuir:

- análises;
- planejamento;
- blocos;
- prompts;
- bugs;
- feedbacks;
- validação;
- fechamento.

Regra oficial:

```txt
Cada feature, refatoração, correção estrutural ou implementação relevante deve criar uma nova sessão em Docs/06_sessoes/.
```

---

# 24. Quando Criar Um Novo Bloco

Criar um novo bloco quando a tarefa for uma unidade clara de implementação.

Um bloco não deve ser grande demais.

Bons blocos:

```txt
bloco_00_criar_estrutura_base
bloco_01_configurar_rotas
bloco_02_implementar_login
bloco_03_criar_dashboard
bloco_04_validar_responsividade
```

Blocos ruins:

```txt
bloco_01_fazer_o_sistema_todo
bloco_final
ajustes_gerais
coisas
mudancas
```

---

# 25. Checklist Antes de Iniciar Um Bloco

Antes de iniciar qualquer bloco, verificar:

```md
- [ ] O objetivo está claro?
- [ ] O escopo está definido?
- [ ] O fora de escopo está definido?
- [ ] Os arquivos envolvidos foram mapeados?
- [ ] Os critérios de aceite foram definidos?
- [ ] O prompt foi gerado?
- [ ] O bloco anterior foi validado?
- [ ] As pendências P1/P2 foram resolvidas?
```

---

# 26. Checklist Após Finalizar Um Bloco

Após finalizar qualquer bloco, verificar:

```md
- [ ] O código foi implementado?
- [ ] A aplicação continua rodando?
- [ ] Os critérios de aceite foram atendidos?
- [ ] O feedback foi gerado?
- [ ] As pendências foram registradas?
- [ ] O commit semântico foi sugerido?
- [ ] A documentação foi atualizada, se necessário?
- [ ] O bloco foi validado?
```

---

# 27. Glossário Oficial

O arquivo `glossario.md` é o dicionário oficial do projeto.

Local recomendado:

```txt
Docs/09_governanca/glossario.md
```

Ele deve registrar termos, siglas, nomes de módulos, regras de linguagem e conceitos importantes para evitar interpretações diferentes entre pessoas e IAs.

Termos recomendados:

```txt
DDAD
Sessão
Bloco
Prompt
Feedback
Validação
Pendência
Commit semântico
Arquivo morto
Contrato técnico
Governança técnica
Stack técnica
Design system
Deploy local
Deploy produção
```

---

# 28. Aplicação da DDAD

A DDAD pode ser aplicada em:

- sistemas web;
- APIs;
- aplicações mobile;
- SaaS;
- MVPs;
- startups;
- produtos corporativos;
- landing pages;
- sistemas internos;
- plataformas com múltiplos apps;
- monorepos;
- projetos com IA como executor de código.

---

# 29. Benefícios Esperados

## 29.1 Técnicos

- menos dívida técnica;
- mais organização;
- melhor rastreabilidade;
- melhor escalabilidade;
- melhor manutenção;
- menos inconsistência entre módulos.

---

## 29.2 Operacionais

- onboarding simplificado;
- menos dependência de pessoas;
- histórico completo de decisões;
- melhor gestão de escopo;
- melhor previsibilidade.

---

## 29.3 Uso de IA

- contexto persistente;
- menos alucinações;
- melhor qualidade de código;
- menos retrabalho;
- maior controle sobre implementação;
- auditoria objetiva do que foi feito.

---

# 30. Prompt Base Para Padronização da Pasta Docs

Este prompt pode ser usado com Claude Code ou outra IA executora para padronizar a pasta `Docs/`.

```md
Você é o executor técnico do projeto seguindo a metodologia DDAD — Document-Driven AI Development.

## Objetivo

Padronizar a estrutura da pasta `Docs/` conforme a arquitetura DDAD definida no projeto.

## Contexto

Atualmente a pasta `Docs/` pode possuir estruturas com nomes misturando espaços, acentos, letras maiúsculas e duplicidade de conceitos como `Planejamento`, `Plan`, `Feedback_análises`, `Levantamento_Informações`, etc.

A metodologia DDAD define que a documentação é a fonte única da verdade do projeto. Portanto, a estrutura de documentação precisa ser previsível, rastreável, limpa e padronizada.

## Regras Obrigatórias

1. Usar nomes em `snake_case`.
2. Não usar acentos.
3. Não usar espaços.
4. Usar numeração lógica nas pastas principais.
5. Não apagar nenhum documento existente.
6. Apenas mover/renomear arquivos e pastas.
7. Caso exista dúvida sobre algum arquivo, mover para `Docs/99_arquivo_morto/pendente_classificacao/`.
8. Manter a metodologia DDAD como documento central.
9. Ao final, gerar um feedback em Markdown.
10. Sugerir commit semântico.
11. Não realizar commit se não for autorizado.

## Estrutura Final Desejada

Docs/
├── 00_metodologia/
├── 01_arquitetura/
├── 02_produto/
├── 03_desenvolvimento/
├── 04_analises/
├── 05_implementacoes/
├── 06_sessoes/
├── 07_feedbacks/
├── 08_deploy/
├── 09_governanca/
├── 10_referencias/
└── 99_arquivo_morto/

## Tarefas

1. Criar a nova estrutura de pastas.
2. Mover a metodologia DDAD para `Docs/00_metodologia/arquitetura_ddad.md`.
3. Renomear sessões existentes para snake_case e sem acentos.
4. Padronizar as pastas internas de cada sessão:
   - `01_analises`
   - `02_planejamento`
   - `03_bugs`
   - `04_feedback`
   - `05_validacao`
5. Dentro de `02_planejamento`, manter:
   - `blocos/`
   - `prompts/`
6. Remover pastas vazias desnecessárias.
7. Caso alguma pasta tenha conteúdo duvidoso, mover para `99_arquivo_morto/pendente_classificacao/`.
8. Criar arquivos `README.md` básicos nas pastas principais explicando a finalidade de cada uma.
9. Gerar um arquivo de feedback final.

## Feedback Final Obrigatório

Gerar um feedback contendo:

- estrutura anterior identificada;
- estrutura nova criada;
- arquivos movidos;
- arquivos renomeados;
- pastas criadas;
- pastas removidas;
- pendências encontradas;
- validações executadas;
- resultado do git status;
- commit semântico sugerido.

## Commit Semântico Sugerido

`docs(ddad): padroniza estrutura da pasta Docs`
```

---

# 31. Assinatura da Metodologia

```txt
DDAD

Documentação Primeiro.
Arquitetura Primeiro.
IA como Executor.
Auditoria Contínua.
Evolução Incremental.

LK Technologies Brasil
```

---

# 32. Regra Final

Este documento deve ser tratado como o documento chave da arquitetura DDAD para desenvolvimento de projetos.

Sempre que um projeto novo for iniciado, a estrutura da pasta `Docs/` deve ser baseada neste documento.

Sempre que uma IA for usada para implementar, corrigir, refatorar ou auditar um projeto, ela deve receber este documento como referência metodológica.

A DDAD existe para garantir que o desenvolvimento não dependa apenas de memória, improviso ou tentativa e erro.

A documentação guia o projeto.

A arquitetura protege o sistema.

A IA executa com controle.

O feedback garante rastreabilidade.

O commit registra a evolução.
