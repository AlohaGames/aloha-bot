import { SlashCommandBuilder } from "@discordjs/builders";
import { DiscordOnInteractionContext } from "../../../DiscordContext";
import { BasicSlashCommand } from "../../BasicSlashCommand";

export class PingSlashCommand extends BasicSlashCommand {
  register(name: string): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName(name)
      .setDescription("Replies with Pong!");
  }

  execute(ctx: DiscordOnInteractionContext): void {
    ctx.interaction.reply("pong");
  }
}
