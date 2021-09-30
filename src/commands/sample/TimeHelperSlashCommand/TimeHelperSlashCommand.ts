import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageSelectMenu } from "discord.js";
import {
  DiscordContext,
  DiscordOnInteractionContext,
} from "../../../DiscordContext";
import { BasicSlashCommand } from "../../BasicSlashCommand";

export class TimeHelperSlashCommand extends BasicSlashCommand {
  register(name: string): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName(name)
      .setDescription("Help you to find out what time is it");
  }

  async onRegister(ctx: DiscordContext): Promise<void> {
    console.log("Registered command time helper");
    ctx.client.on("interactionCreate", (interaction) => {
      if (interaction.isSelectMenu() && interaction.customId === "hour-menu") {
        if (interaction.values[0] === "get-hour-interaction") {
          interaction.reply(new Date().getHours().toString());
        }
        if (interaction.values[0] === "get-minute-interaction") {
          interaction.reply(new Date().getMinutes().toString());
        }
      }
    });
  }

  async execute(ctx: DiscordOnInteractionContext): Promise<void> {
    const hourMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("hour-menu")
        .setPlaceholder("What do you need ?")
        .addOptions([
          {
            label: "Hour",
            description: "Know the actual hour",
            value: "get-hour-interaction",
          },
          {
            label: "Minutes",
            description: "Know the actual minutes",
            value: "get-minute-interaction",
          },
        ])
    );

    await ctx.interaction.reply({
      content: "Here we go",
      components: [hourMenu],
    });
  }
}
