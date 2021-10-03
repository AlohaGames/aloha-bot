/*
  Warnings:

  - You are about to drop the column `author_id` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Film` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `release` to the `Film` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorId" TEXT NOT NULL,
    "note" REAL NOT NULL,
    "comment" TEXT,
    "FilmId" TEXT,
    CONSTRAINT "Note_FilmId_fkey" FOREIGN KEY ("FilmId") REFERENCES "Film" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Note" ("FilmId", "comment", "id", "note") SELECT "FilmId", "comment", "id", "note" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
CREATE TABLE "new_Film" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guildId" TEXT NOT NULL,
    "watchDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "director" TEXT NOT NULL,
    "release" DATETIME NOT NULL
);
INSERT INTO "new_Film" ("director", "guildId", "id", "title", "watchDate") SELECT "director", "guildId", "id", "title", "watchDate" FROM "Film";
DROP TABLE "Film";
ALTER TABLE "new_Film" RENAME TO "Film";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
