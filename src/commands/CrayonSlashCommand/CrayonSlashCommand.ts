import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageSelectMenu } from "discord.js";
import { BasicSlashCommand } from "../BasicSlashCommand";
import {
  DiscordContext,
  DiscordOnInteractionContext,
} from "../../DiscordContext";

export class CrayonSlashCommand extends BasicSlashCommand {
  count = 0;

  register(name: string): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName(name)
      .setDescription("Count the number of times the crayon is back");
  }

  async onRegister(ctx: DiscordContext): Promise<void> {
    const { storageManager } = ctx;
    ctx.client.on("interactionCreate", async (interaction) => {
      if (
        interaction.isSelectMenu() &&
        interaction.customId === "crayon-menu"
      ) {
        const storage = await storageManager.getStorage(interaction.guildId);
        if (interaction.values[0] === "yes-crayon-interaction") {
          const updateCrayonCount = await storage?.updateGuildData({
            countCrayon: (this.count += 1),
          });
          interaction.update(
            `The crayon is back !! Total : ${updateCrayonCount?.countCrayon}`
          );
        }
        if (interaction.values[0] === "no-crayon-interaction") {
          const updateCrayonCount = await storage?.updateGuildData({
            countCrayon: (this.count = 0),
          });
          interaction.update(`RIP ! Total : ${updateCrayonCount?.countCrayon}`);
        }
      }
    });
  }

  async execute(ctx: DiscordOnInteractionContext): Promise<void> {
    const crayonMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("crayon-menu")
        .setPlaceholder("Is the crayon back?")
        .addOptions([
          {
            label: "Yes",
            description: "Yes value",
            value: "yes-crayon-interaction",
          },
          {
            label: "No",
            description: "No value",
            value: "no-crayon-interaction",
          },
        ])
    );

    await ctx.interaction.reply({
      content: "Social experiment",
      components: [crayonMenu],
    });
  }
}
