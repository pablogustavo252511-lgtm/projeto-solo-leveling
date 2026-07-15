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

Use MySQL com Prisma. No Render, configure `DATABASE_URL` nas Environment Variables:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
JWT_SECRET="daily-hunter-dev-secret-change-in-production"
NODE_ENV=production
PORT=3000
FRONTEND_ORIGIN="*"
USE_LOCAL_DB=false
```

No Render, use a URL real do MySQL do Clever Cloud em `DATABASE_URL`.
O Build Command deve ser:

```txt
npm install && npx prisma generate && npx prisma migrate deploy
```

O Start Command deve ser:

```txt
npm start
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
