-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guildId" TEXT NOT NULL,
    "viewingDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "director" TEXT,
    "release" DATETIME,
    "poster" TEXT
);
INSERT INTO "new_Movies" ("director", "guildId", "id", "poster", "release", "title", "viewingDate") SELECT "director", "guildId", "id", "poster", "release", "title", "viewingDate" FROM "Movies";
DROP TABLE "Movies";
ALTER TABLE "new_Movies" RENAME TO "Movies";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
