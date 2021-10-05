/*
  Warnings:

  - You are about to drop the `Film` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Note` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `author_id` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Note` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Made the column `FilmId` on table `Note` required. This step will fail if there are existing NULL values in that column.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Film";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Movies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guildId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "viewingDate" TEXT,
    "director" TEXT,
    "release" TEXT,
    "poster" TEXT
);

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
INSERT INTO "new_Note" ("FilmId", "comment", "note") SELECT "FilmId", "comment", "note" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
