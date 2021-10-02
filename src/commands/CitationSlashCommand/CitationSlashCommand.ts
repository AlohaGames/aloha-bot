import { SlashCommandBuilder } from "@discordjs/builders";
import { DiscordOnInteractionContext } from "../../DiscordContext";
import { BasicSlashCommand } from "./../BasicSlashCommand";
import { getShortFrenchFormatDateNow } from "../../common/date-utils";

export class CitationSlashCommand extends BasicSlashCommand {
  register(
    name: string
  ): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
    return new SlashCommandBuilder()
      .setName(name)
      .setDescription("Create a citation")
      .addUserOption((option) =>
        option.setName("from").setDescription("from").setRequired(true)
      )
      .addStringOption((option) =>
        option.setName("citation").setDescription("citation").setRequired(true)
      );
  }

  execute(ctx: DiscordOnInteractionContext): void | Promise<void> {
    const user = ctx.interaction.options.getUser("from");
    const citation = ctx.interaction.options.getString("citation");
    const dateFormat = getShortFrenchFormatDateNow();

    if (!user || !citation) {
      throw new Error("User or citation missing");
    }

    ctx.interaction.reply(`${dateFormat} - <@${user.id}> \n> "*${citation}*"`);
  }
}
