import { Storage } from "./Storage";
import prismaInstance from "./prisma";

export class StorageManager {
  storages: Record<string, Storage>;

  constructor() {
    this.storages = {};
  }

  async getStorages(): Promise<Storage[]> {
    const guilds = await prismaInstance.botGuild.findMany();
    return guilds.map((g) => new Storage(g.id));
  }

  async getStorage(guildId: string | null): Promise<Storage | null> {
    if (!guildId) {
      return null;
    }

    const storage = this.storages[guildId];
    if (!storage) {
      const storage = new Storage(guildId);
      await storage.instanciateGuildData();
      this.storages[guildId] = storage;
      return storage;
    } else {
      const storage = this.storages[guildId];
      return storage;
    }
  }
}
