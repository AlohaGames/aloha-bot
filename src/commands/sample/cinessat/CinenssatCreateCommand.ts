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
    register(name: string): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName(name)
            .setDescription("Ajout d'un film que vous avez déjà regarder lors d'une soirée Cin'ENSSAT")
            .addStringOption((option) =>
                option.setName("title").setDescription("Ajout du titre du film").setRequired(true))
            .addStringOption((option) =>
                option.setName("director").setDescription("Ajout du réalisateur").setRequired(true))
            .addStringOption((option) =>
                option.setName("date").setDescription("Date de sortie (format : DD/MM/yyyy)").setRequired(true));
    }

    async onRegister(ctx: DiscordContext): Promise<void> {
        console.log("Registered command create cinenssat");
        await ctx.client.on("interactionCreate", (interaction) => {
            if (interaction.isButton() && interaction.customId === "other") {
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
            }
        });
    }

    async execute(ctx: DiscordOnInteractionContext): Promise<void> {
        // embed for the movie
        const title = ctx.interaction.options.getString("title", true);
        const director = ctx.interaction.options.getString("director", true);
        const release = ctx.interaction.options.getString("date", true);

        const embed = new MessageEmbed()
            .setColor('#C53A41')
            .setAuthor(title.toUpperCase() + " (" + release + ")")
            .setFooter("Film produit par " + director)

        // interaction
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
            embeds: [embed],
            components: [day],
        });
    }
}