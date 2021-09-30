import { SlashCommandBuilder } from "@discordjs/builders";
import { DiscordOnInteractionContext } from "../../../DiscordContext";
import { BasicSlashCommand } from "../../BasicSlashCommand";

export class PingSlashCommand extends BasicSlashCommand {
  register(name: string): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName(name)
      .setDescription("Replies with Pong!");
  }

  async execute(ctx: DiscordOnInteractionContext): Promise<void> {
    ctx.interaction.reply("pong");
  }
}
