import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageSelectMenu } from "discord.js";
import {
    DiscordContext,
    DiscordOnInteractionContext,
    DiscordOnMessageContext,
} from "../../DiscordContext";
import { BasicSlashCommand } from "../BasicSlashCommand";

export class CrayonSlashCommand extends BasicSlashCommand {

    count: number = 0;

    register(name: string): SlashCommandBuilder {
        return new SlashCommandBuilder().setName(name).setDescription("Count the number of times the crayon back");
    }

    async onRegister(ctx: DiscordContext): Promise<void> {
        const { storageManager } = ctx;
        ctx.client.on("interactionCreate", async (interaction) => {
            if (interaction.isSelectMenu() && interaction.customId === "crayon-menu") {
                const storage = await storageManager.getStorage(interaction.guildId)
                if (interaction.values[0] === "yes-crayon-interaction") {
                    const updateCrayonCount = await storage?.updateGuildData({
                        countCrayon: this.count +=1,
                    });
                    //const updateCrayonCount = await storage?.getGuildData();
                    interaction.reply(`${JSON.stringify(updateCrayonCount?.countCrayon)}`);
                }
                if (interaction.values[0] === "no-crayon-interaction") {
                    const updateCrayonCount = await storage?.updateGuildData({
                        countCrayon: this.count = 0,
                    });
                    //const updateCrayonCount = await storage?.getGuildData();
                    interaction.reply(`${JSON.stringify(updateCrayonCount?.countCrayon)}`);
                }
            }
        });
    }

    async execute(ctx: DiscordOnInteractionContext): Promise<void> {
        const crayonMenu = new MessageActionRow().addComponents(
            new MessageSelectMenu().setCustomId("crayon-menu").setPlaceholder("Is the crayon back?").addOptions([
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