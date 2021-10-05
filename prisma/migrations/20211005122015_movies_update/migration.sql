/*
  Warnings:

  - Added the required column `poster` to the `Movies` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guildId" TEXT NOT NULL,
    "viewingDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "director" TEXT NOT NULL,
    "release" DATETIME NOT NULL,
    "poster" TEXT NOT NULL
);
INSERT INTO "new_Movies" ("director", "guildId", "id", "release", "title", "viewingDate") SELECT "director", "guildId", "id", "release", "title", "viewingDate" FROM "Movies";
DROP TABLE "Movies";
ALTER TABLE "new_Movies" RENAME TO "Movies";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
