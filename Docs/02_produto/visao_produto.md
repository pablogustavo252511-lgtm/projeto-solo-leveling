# Solo Leveling — Daily Hunter System

## 📖 Visão Geral

Sistema inspirado no conceito de evolução diária de Solo Leveling.

O objetivo é permitir que o usuário evolua seu personagem através da conclusão de desafios diários, ganhando experiência (XP), subindo de nível e enfrentando penalidades e bosses quando falhar.

---

# 🏗️ Arquitetura

## Banco de Dados

**MySQL (Clever Cloud)**

## Backend

**Node.js + Express + Prisma**

Hospedagem:

* Render

## Frontend

**React ou HTML/CSS/JavaScript**

Hospedagem:

* Vercel

---

# ⚔️ Mecânica Principal

## Início do Jogador

Todo jogador inicia com:

```txt
Nível: 1
XP: 0
Rank: E
```

---

## Desafios Diários

### Nível 1

* Correr 2 km
* Fazer 20 flexões
* Estudar 30 minutos

### Nível 2

* Correr 3 km
* Fazer 40 flexões
* Estudar 45 minutos

### Nível 3

* Correr 5 km
* Fazer 60 flexões
* Estudar 1 hora

Cada nível aumenta a dificuldade dos desafios.

---

## Sistema de XP

Cada desafio concluído gera experiência.

Exemplo:

| Desafio        | XP    |
| -------------- | ----- |
| Correr 2 km    | 20 XP |
| 20 Flexões     | 15 XP |
| Estudar 30 min | 15 XP |

Total:

```txt
50 XP
```

---

## Sistema de Level Up

| Nível | XP Necessário |
| ----- | ------------- |
| 1 → 2 | 100 XP        |
| 2 → 3 | 250 XP        |
| 3 → 4 | 500 XP        |
| 4 → 5 | 1000 XP       |

Ao atingir o XP necessário:

```txt
LEVEL UP
```

---

## Sistema de Penalidade

Caso o usuário não cumpra as tarefas:

```txt
Missão Falhou
```

Aplicar:

* Redução de XP
* Perda de Rank
* Missão de Penalidade
* Boss obrigatório

---

## Sistema de Boss

Quando uma penalidade ocorre:

```txt
Boss Spawnado
```

### Boss Nível 1

* 50 Flexões
* 3 km de corrida

### Boss Nível 2

* 100 Flexões
* 5 km de corrida

### Boss Nível 3

* 150 Flexões
* 8 km de corrida

Ao derrotar o boss:

```txt
XP Recuperado
Recompensas Liberadas
```

---

# 🚀 Funcionalidades

## Autenticação

### Cadastro

* Nome
* Email
* Senha

### Login

* Email
* Senha

---

## Dashboard

Exibir:

* Nome do jogador
* Nível
* XP Atual
* Rank
* Missões do dia

Barra de XP:

```txt
75 / 100 XP
```

---

## Sistema de Desafios

Funcionalidades:

* Criar desafio
* Editar desafio
* Excluir desafio
* Marcar como concluído
* Receber XP automaticamente

---

## Sistema de Evolução

Exibir:

* XP atual
* Próximo nível
* Histórico de evolução
* Ranking pessoal

---

## Sistema de Boss

Exibir:

* Boss ativo
* Dificuldade
* Penalidade
* Recompensa
* Tempo restante

---

## Ranking

Exibir:

### Top Hunters

Ordenado por:

* XP
* Nível
* Missões concluídas
* Bosses derrotados

---

# 🗄️ Banco de Dados

## users

```sql
id
nome
email
senha
level
xp
rank
created_at
```

---

## challenges

```sql
id
user_id
title
description
difficulty
xp_reward
status
due_date
created_at
```

---

## bosses

```sql
id
user_id
name
level_required
reward_xp
penalty
status
created_at
```

---

## history

```sql
id
user_id
action
xp_earned
created_at
```

---

# 🔌 API Backend

## Usuários

```http
POST /register
POST /login
GET /profile
```

---

## Desafios

```http
GET /challenges
POST /challenges
PUT /challenges/:id
DELETE /challenges/:id
```

---

## Evolução

```http
GET /player/status
POST /player/level-up
```

---

## Boss

```http
GET /boss
POST /boss/defeat
```

---

# 📁 Estrutura do Projeto

```txt
solo-leveling-system/

backend/
├── server.js
├── routes/
├── controllers/
├── services/
├── prisma/
├── middleware/
└── package.json

frontend/
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── desafios.html
├── boss.html
├── ranking.html
├── perfil.html
├── css/
├── js/
└── assets/
```

---

# 🎨 Design

## Tema

* Dark Mode
* Azul Neon
* Roxo
* Preto

## Componentes

* Cards futuristas
* Barra de XP animada
* Sistema de Rank
* Sistema de Boss
* Notificações estilo RPG
* Efeitos visuais inspirados em HUD de jogo

---

# 📌 Nome Oficial

## Solo Leveling — Daily Hunter System

### Slogan

> Levante-se. Evolua. Domine seus desafios.
