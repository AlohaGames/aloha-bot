import { Client, CommandInteraction, Interaction, Message } from "discord.js";
import { StorageManager } from "./db/StorageManager";
import {
  DiscordContext,
  DiscordOnInteractionContext,
  DiscordOnInteractionCreateContext,
  DiscordOnMessageContext,
} from "./DiscordContext";

export class ContextManager {
  storageManager: StorageManager;
  client: Client;

  constructor(client: Client) {
    this.client = client;
    this.storageManager = new StorageManager();
  }

  getDiscordContext(): DiscordContext {
    return {
      client: this.client,
      storageManager: this.storageManager,
    };
  }

  getDiscordOnInteractionContext(
    interaction: CommandInteraction
  ): DiscordOnInteractionContext {
    return {
      ...this.getDiscordContext(),
      interaction,
    };
  }

  async getDiscordOnMessageContext(
    message: Message
  ): Promise<DiscordOnMessageContext> {
    return {
      ...this.getDiscordContext(),
      storage: await this.storageManager.getStorage(message.guildId),
      message,
    };
  }

  getDiscordOnInteractionCreateContext(
    interaction: Interaction
  ): DiscordOnInteractionCreateContext {
    return {
      ...this.getDiscordContext(),
      interaction: interaction,
    };
  }
}
