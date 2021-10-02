import { SlashCommandBuilder } from "@discordjs/builders";
import { DiscordContext, DiscordOnInteractionContext } from "../DiscordContext";

export interface BasicSlashCommand {
  onRegister?(ctx: DiscordContext): void;
}

export abstract class BasicSlashCommand {
  abstract register(name: string): SlashCommandBuilder;

  abstract execute(ctx: DiscordOnInteractionContext): Promise<void> | void;
}
