-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BotGuild" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "messageReactId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "countCrayon" INTEGER DEFAULT 0
);
INSERT INTO "new_BotGuild" ("countCrayon", "createdAt", "id", "messageReactId") SELECT "countCrayon", "createdAt", "id", "messageReactId" FROM "BotGuild";
DROP TABLE "BotGuild";
ALTER TABLE "new_BotGuild" RENAME TO "BotGuild";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
