import { BotGuild, Prisma } from ".prisma/client";
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
