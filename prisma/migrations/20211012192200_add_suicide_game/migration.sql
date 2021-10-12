-- AlterTable
ALTER TABLE "BotGuild" ADD COLUMN "punishRoleId" TEXT;

-- CreateTable
CREATE TABLE "SuicidalScore" (
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "guildId")
);
