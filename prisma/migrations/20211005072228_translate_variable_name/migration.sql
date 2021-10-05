/*
  Warnings:

  - You are about to drop the `Film` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Film";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Movies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guildId" TEXT NOT NULL,
    "viewingDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "director" TEXT NOT NULL,
    "release" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorId" TEXT NOT NULL,
    "note" REAL NOT NULL,
    "comment" TEXT,
    "FilmId" TEXT,
    CONSTRAINT "Note_FilmId_fkey" FOREIGN KEY ("FilmId") REFERENCES "Movies" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Note" ("FilmId", "authorId", "comment", "id", "note") SELECT "FilmId", "authorId", "comment", "id", "note" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
