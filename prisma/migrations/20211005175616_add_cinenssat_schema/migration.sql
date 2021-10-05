-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "Note" (
    "authorId" TEXT NOT NULL,
    "note" REAL NOT NULL,
    "comment" TEXT,
    "FilmId" TEXT NOT NULL,

    PRIMARY KEY ("authorId", "FilmId"),
    CONSTRAINT "Note_FilmId_fkey" FOREIGN KEY ("FilmId") REFERENCES "Movies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
