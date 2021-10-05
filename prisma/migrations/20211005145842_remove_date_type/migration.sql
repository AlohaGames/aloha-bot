-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guildId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "viewingDate" TEXT,
    "description" TEXT,
    "director" TEXT,
    "release" TEXT,
    "poster" TEXT
);
INSERT INTO "new_Movies" ("description", "director", "guildId", "id", "poster", "release", "title", "viewingDate") SELECT "description", "director", "guildId", "id", "poster", "release", "title", "viewingDate" FROM "Movies";
DROP TABLE "Movies";
ALTER TABLE "new_Movies" RENAME TO "Movies";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
