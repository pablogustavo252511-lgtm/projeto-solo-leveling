-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('pendente', 'concluido', 'falhou');

-- CreateEnum
CREATE TYPE "BossStatus" AS ENUM ('ativo', 'derrotado', 'falhou');

-- CreateTable
CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "senha" TEXT NOT NULL,
  "level" INTEGER NOT NULL DEFAULT 1,
  "xp" INTEGER NOT NULL DEFAULT 0,
  "rank" TEXT NOT NULL DEFAULT 'E',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenges" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "difficulty" TEXT NOT NULL,
  "xp_reward" INTEGER NOT NULL,
  "status" "ChallengeStatus" NOT NULL DEFAULT 'pendente',
  "due_date" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bosses" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "challenge_id" TEXT,
  "source" TEXT NOT NULL DEFAULT 'manual',
  "name" TEXT NOT NULL,
  "level_required" INTEGER NOT NULL,
  "difficulty" TEXT NOT NULL,
  "reward_xp" INTEGER NOT NULL,
  "penalty" TEXT NOT NULL,
  "lock_reason" TEXT,
  "status" "BossStatus" NOT NULL DEFAULT 'ativo',
  "time_limit" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "bosses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "xp_earned" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "challenges_user_id_idx" ON "challenges"("user_id");

-- CreateIndex
CREATE INDEX "bosses_user_id_idx" ON "bosses"("user_id");

-- CreateIndex
CREATE INDEX "history_user_id_idx" ON "history"("user_id");

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bosses" ADD CONSTRAINT "bosses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
