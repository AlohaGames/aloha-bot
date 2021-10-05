/*
  Warnings:

  - You are about to drop the column `description` on the `Movies` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guildId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "viewingDate" TEXT,
    "director" TEXT,
    "release" TEXT,
    "poster" TEXT
);
INSERT INTO "new_Movies" ("director", "guildId", "id", "poster", "release", "title", "viewingDate") SELECT "director", "guildId", "id", "poster", "release", "title", "viewingDate" FROM "Movies";
DROP TABLE "Movies";
ALTER TABLE "new_Movies" RENAME TO "Movies";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
