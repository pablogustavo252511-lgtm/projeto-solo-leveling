# Backend - Solo Leveling Daily Hunter System

## Rodar localmente

```powershell
cd "C:\Users\Pablo\Documents\projeto solo leveling\solo-leveling-system\backend"
npm.cmd install
npx.cmd prisma generate
npm.cmd start
```

A API fica em:

```txt
http://localhost:3000
```

## Banco de dados

O arquivo `.env` ja existe para desenvolvimento:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
JWT_SECRET="daily-hunter-dev-secret-change-in-production"
PORT=3000
FRONTEND_ORIGIN="*"
USE_LOCAL_DB=false
```

No Render, use a `Internal Database URL` real do banco Postgres em `DATABASE_URL`.
Depois rode:

```powershell
npx.cmd prisma db push --schema prisma/schema.prisma
npm.cmd run db:migrate-json
```

## Validacoes executadas

```powershell
npx.cmd prisma validate
npx.cmd prisma generate
node --check server.js
node -e "require('./server'); console.log('server import ok')"
```

Tambem foi feito teste HTTP temporario em:

```txt
GET http://localhost:3000/
```

Resposta esperada:

```json
{"name":"Solo Leveling - Daily Hunter System API","status":"online"}
```
