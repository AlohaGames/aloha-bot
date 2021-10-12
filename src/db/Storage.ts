import { BotGuild, Movies, Note, Prisma, Shortcut } from ".prisma/client";
import prismaInstance from "./prisma";

export class Storage {
  guildId: string;

  constructor(guildId: string) {
    this.guildId = guildId;
  }

  async resetSuicideGame(userId: string): Promise<void> {
    await prismaInstance.suicidalScore.delete({
      where: {
        userId_guildId: {
          userId,
          guildId: this.guildId,
        },
      },
    });
  }

  async incrementSuicideGame(userId: string): Promise<number> {
    const suicidalScore = await prismaInstance.suicidalScore.upsert({
      where: {
        userId_guildId: {
          userId,
          guildId: this.guildId,
        },
      },
      create: {
        guildId: this.guildId,
        userId,
        score: 1,
      },
      update: {
        guildId: this.guildId,
        userId,
        score: {
          increment: 1,
        },
      },
    });

    return suicidalScore.score;
  }

  async instanciateGuildData(): Promise<void> {
    const exists = await prismaInstance.botGuild.findUnique({
      where: {
        id: this.guildId,
      },
    });
    if (!exists) {
      await prismaInstance.botGuild.create({
        data: {
          id: this.guildId,
        },
      });
    }
  }

  async getShortcuts(authorId: string): Promise<Shortcut[]> {
    const shortcuts = await prismaInstance.shortcut.findMany({
      where: {
        authorId,
      },
    });
    return shortcuts;
  }

  async createShortcut(
    name: string,
    authorId: string,
    emojies: string[]
  ): Promise<Shortcut> {
    const shortcut = await prismaInstance.shortcut.create({
      data: {
        name,
        authorId,
        emojies: JSON.stringify(emojies),
      },
    });
    return shortcut;
  }

  async getShortcut(name: string, authorId: string): Promise<Shortcut> {
    const shortcut = await prismaInstance.shortcut.findFirst({
      where: {
        name,
        authorId,
      },
    });
    if (!shortcut) {
      throw new Error(`No sortcut ${name} found`);
    }
    return shortcut;
  }

  async deleteShortcut(name: string, authorId: string): Promise<void> {
    await prismaInstance.shortcut.deleteMany({
      where: {
        name,
        authorId,
      },
    });
  }

  async getGuildData(): Promise<BotGuild | null> {
    const guildData = await prismaInstance.botGuild.findUnique({
      where: {
        id: this.guildId,
      },
    });
    return guildData;
  }

  async updateGuildData(data: Prisma.BotGuildUpdateInput): Promise<BotGuild> {
    return await prismaInstance.botGuild.update({
      where: { id: this.guildId },
      data,
    });
  }

  // movies part
  async createMovies(
    guildId: string,
    title: string,
    viewingDate?: string,
    director?: string,
    release?: string,
    poster?: string
  ): Promise<Movies> {
    return await prismaInstance.movies.create({
      data: {
        guildId,
        viewingDate,
        title,
        director,
        release,
        poster,
      },
    });
  }

  async getMovie(title: string, guildId: string): Promise<Movies> {
    const movie = await prismaInstance.movies.findFirst({
      where: {
        title,
        guildId,
      },
    });
    if (!movie) {
      throw new Error(`No movie named ${title} found`);
    }
    return movie;
  }

  async updateMoviesViewingDate(id: string, date: string): Promise<Movies> {
    return await prismaInstance.movies.update({
      where: {
        id: id,
      },
      data: {
        viewingDate: date,
      },
    });
  }

  async createOrUpdateNote(
    authorId: string,
    note: number,
    comment: string,
    FilmId: string
  ): Promise<Note> {
    return await prismaInstance.note.upsert({
      where: {
        authorId_FilmId: {
          authorId: authorId,
          FilmId: FilmId,
        },
      },
      update: {
        note: note,
      },
      create: {
        authorId,
        note,
        comment,
        FilmId,
      },
    });
  }

  async getNoteForAFilm(FilmId: string): Promise<Note[]> {
    return await prismaInstance.note.findMany({
      where: {
        FilmId: FilmId,
      },
    });
  }
}
