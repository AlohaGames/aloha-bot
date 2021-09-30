import { Client, CommandInteraction, Interaction, Message } from "discord.js";
import { Storage } from "./db/Storage";
import { StorageManager } from "./db/StorageManager";

export interface DiscordContext {
  client: Client;
  storageManager: StorageManager;
}

export interface DiscordOnMessageContext extends DiscordContext {
  message: Message;
  storage: Storage | null;
}

export interface DiscordOnInteractionContext extends DiscordContext {
  interaction: CommandInteraction;
}

export interface DiscordOnInteractionCreateContext extends DiscordContext {
  interaction: Interaction;
}
