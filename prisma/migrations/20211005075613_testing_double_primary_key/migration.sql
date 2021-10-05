/*
  Warnings:

  - The primary key for the `Note` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Note` table. All the data in the column will be lost.
  - Made the column `FilmId` on table `Note` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "authorId" TEXT NOT NULL,
    "note" REAL NOT NULL,
    "comment" TEXT,
    "FilmId" TEXT NOT NULL,

    PRIMARY KEY ("authorId", "FilmId"),
    CONSTRAINT "Note_FilmId_fkey" FOREIGN KEY ("FilmId") REFERENCES "Movies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Note" ("FilmId", "authorId", "comment", "note") SELECT "FilmId", "authorId", "comment", "note" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
