import { SlashCommandBuilder } from "@discordjs/builders";
import {MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu} from "discord.js";
import {
    DiscordContext,
    DiscordOnInteractionContext,
} from "../../../DiscordContext";
import { BasicSlashCommand } from "../../BasicSlashCommand";
import { DateTime } from "luxon";
import { Utils } from "./Utils";
const utils = new Utils()

export class CinenssatCreateCommand extends BasicSlashCommand {
    register(name: string): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .setName(name)
            .setDescription("Ajout d'un film que vous avez déjà regarder lors d'une soirée Cin'ENSSAT");
    }

    async onRegister(ctx: DiscordContext): Promise<void> {
        console.log("Registered command create cinenssat");
        await ctx.client.on("interactionCreate", (interaction) => {
            if (interaction.isButton() || interaction.isSelectMenu()) {
                switch (interaction.customId) {
                    case "other":
                        interaction.update({
                            content: "A quelle date ?",
                            components: [new MessageActionRow()
                                .addComponents(
                                    new MessageSelectMenu()
                                        .setCustomId('other-day')
                                        .setPlaceholder("Choisir un date")
                                        .addOptions(utils.getDateSelectOptions())
                                )
                            ]
                        });
                        break;
                    case "today" :
                    case "other-day" :
                        interaction.update({
                            content: "Quel notes lui donnes-tu ?",
                            components: [new MessageActionRow()
                                .addComponents(
                                    new MessageSelectMenu()
                                        .setCustomId('note')
                                        .setPlaceholder("Choisir un note")
                                        .addOptions(utils.getNoteSelectOptions())
                                )
                            ]
                        });
                        break;
                    case "note" :
                        interaction.update({
                            content: "C'est fait",
                            components: [],
                            embeds: [new MessageEmbed()
                                .setColor('#C53A41')
                                .setTitle("Test")
                                .setAuthor(interaction.user.tag)
                            ]
                        });
                        break;
                    default : break;
                }
            }
        });
    }

    async execute(ctx: DiscordOnInteractionContext): Promise<void> {
        const date = DateTime.now().toFormat('dd LLL yyyy');
        const day = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("today")
                .setLabel("Aujourd'hui : " + date)
                .setStyle("PRIMARY"),
            new MessageButton()
                .setCustomId("other")
                .setLabel("Autre date")
                .setStyle("SECONDARY")
        );

        await ctx.interaction.reply({
            content: "Vous voulez créer une film",
            components: [day],
        });
    }
}