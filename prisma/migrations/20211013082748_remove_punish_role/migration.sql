/*
  Warnings:

  - You are about to drop the column `punishRoleId` on the `BotGuild` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BotGuild" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "messageReactId" TEXT,
    "countCrayon" INTEGER DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_BotGuild" ("countCrayon", "createdAt", "id", "messageReactId") SELECT "countCrayon", "createdAt", "id", "messageReactId" FROM "BotGuild";
DROP TABLE "BotGuild";
ALTER TABLE "new_BotGuild" RENAME TO "BotGuild";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
