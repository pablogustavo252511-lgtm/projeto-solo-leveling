# Bloco 00 - Implementacao Inicial Full Stack

## 1. Objetivo

Criar a estrutura completa e a primeira implementacao funcional do sistema web
Solo Leveling - Daily Hunter System.

---

## 2. Contexto

O sistema deve tratar o usuario como um hunter que cumpre missoes diarias,
ganha XP, evolui nivel e rank, sofre penalidades e enfrenta bosses.

---

## 3. Escopo Permitido

- Criar `solo-leveling-system/backend`.
- Criar `solo-leveling-system/frontend`.
- Implementar API REST com Express, Prisma, JWT e bcrypt.
- Implementar schema Prisma para MySQL.
- Implementar frontend estatico integrado com a API.
- Criar feedback DDAD ao final.

---

## 4. Escopo Proibido

- Nao configurar deploy real.
- Nao criar secrets reais.
- Nao realizar commit.

---

## 5. Arquivos Envolvidos

- `solo-leveling-system/backend/**`
- `solo-leveling-system/frontend/**`
- `Docs/06_sessoes/sessao_01_implementacao_inicial/**`

---

## 6. Tarefas Obrigatorias

- [x] Criar estrutura de pastas.
- [x] Criar schema Prisma.
- [x] Implementar autenticação.
- [x] Implementar desafios, jogador, bosses, historico e ranking.
- [x] Criar frontend responsivo.
- [ ] Executar validacoes de sintaxe.
- [ ] Gerar feedback final.

---

## 7. Criterios de Aceite

- [ ] O backend possui rotas solicitadas.
- [ ] O schema Prisma possui tabelas solicitadas.
- [ ] O frontend possui paginas solicitadas.
- [ ] Rotas privadas exigem JWT.
- [ ] Regras principais ficam em services.
- [ ] Feedback final foi gerado.

---

## 8. Validacoes Esperadas

- `node --check` nos arquivos JavaScript do backend.
- Verificacao de estrutura de arquivos.
- Registro de limitacoes encontradas.

---

## 9. Feedback Obrigatorio

Gerar feedback em:

`Docs/06_sessoes/sessao_01_implementacao_inicial/04_feedback/feedback_bloco_00_implementacao_inicial_full_stack.md`

---

## 10. Commit Semantico Sugerido

`feat(app): implementa sistema daily hunter inicial`

