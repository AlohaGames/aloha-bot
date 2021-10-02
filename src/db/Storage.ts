import { BotGuild, Prisma, Shortcut } from ".prisma/client";
import prismaInstance from "./prisma";

export class Storage {
  guildId: string;

  constructor(guildId: string) {
    this.guildId = guildId;
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
}
