import { configuration } from "../../../configuration";
import { DateTime } from "luxon";
import { SlashCommandBuilder } from "@discordjs/builders";
import {
  MessageActionRow,
  MessageButton
} from "discord.js";
import { BasicSlashCommand } from "../../BasicSlashCommand";
import {
  DiscordContext,
  DiscordOnInteractionContext,
} from "../../../DiscordContext";
import { TheMovieDb, TheMovieDbLanguage } from "./lib/TheMovieDb";

import { getDateSelectOptions, getNoteSelectOptions } from "./lib/Utils";
import { getMenuSelection, getActionRow } from "./lib/MessageSection";
import { getEmbedMessage } from "./lib/EmbedCreation";

export class CinenssatCommandCreate extends BasicSlashCommand {
  register(
    name: string
  ): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
    return new SlashCommandBuilder()
      .setName(name)
      .setDescription(
        "Ajout d'un film que vous avez déjà regarder lors d'une soirée Cin'ENSSAT"
      )
      .addStringOption((option) =>
        option
          .setName("title")
          .setDescription("Ajout du titre du film")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option.setName("director").setDescription("Ajout du réalisateur")
      )
      .addStringOption((option) =>
        option
          .setName("date")
          .setDescription("Date de sortie (format : DD/MM/yyyy)")
      )
      .addBooleanOption((option) =>
        option.setName("fill").setDescription("Fill data with TheMovieDb API")
      );
  }

  async onRegister(ctx: DiscordContext): Promise<void> {
    console.log("Registered command create cinenssat");
    ctx.client.on("interactionCreate", (interaction) => {
      if (interaction.isButton() && interaction.customId === "other") {
        interaction.update(getMenuSelection(
          "A quelle date ?",
          "other-day",
          "Choisir une date",
          getDateSelectOptions())
        );
      }
      if (interaction.isSelectMenu() && interaction.customId === "other-day") {
        const date = interaction.values[0];
        const old_embed = interaction.message.embeds[0];
        const embed = getEmbedMessage(
          old_embed.author?.name || "Unknow",
          undefined,
          old_embed.description || undefined,
          old_embed.footer?.text,
          old_embed.image?.url,
          undefined
        )

        embed.addField("Date de visionnage sur " + interaction.guild?.name, date)

        interaction.update({
          content: null,
          embeds: [embed],
          components: [getActionRow("note", "Quelle note lui donnes-tu ?", getNoteSelectOptions())]
        });
      }
      if (interaction.isSelectMenu() && interaction.customId === "note") {
        const note = interaction.values[0]
        const old_embed = interaction.message.embeds[0];

        const fields = old_embed.fields
        let existingNoteField = false
        fields?.forEach(field => {
          if (field.name.includes("Note")) {
            existingNoteField = true
            field.name = "Notes attribuées"
            field.value = field.value + "\n" + "<@" + interaction.user.id + "> : " + note + "/10"
          }
        })

        const embed = getEmbedMessage(
          old_embed.author?.name || "Unknow",
          undefined,
          old_embed.description || undefined,
          old_embed.footer?.text,
          old_embed.image?.url,
          old_embed.fields
        )

        if (!existingNoteField) {
          embed.addField("Note attribuée", "<@" + interaction.user.id + "> : " + note + "/10", true)
        }

        interaction.update({
          content: null,
          embeds: [embed],
          components: [
            getActionRow("note", "Quelle note lui donnes-tu ?", getNoteSelectOptions()),
            new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId("close")
                .setLabel("Clôture des notes")
                .setStyle("DANGER")
            )
          ]
        });
      }
      if (interaction.isButton() && interaction.customId === "close") {
        interaction.update({
          components: []
        });
      }
    });
  }

  async execute(ctx: DiscordOnInteractionContext): Promise<void> {
    // Embed for the movie
    const fill = ctx.interaction.options.getBoolean("fill") || false;

    const title = ctx.interaction.options.getString("title", true);
    const director = ctx.interaction.options.getString("director");
    const release = ctx.interaction.options.getString("date");
    const description = ctx.interaction.options.getString("description");
    const url = ctx.interaction.options.getString("url");

    // Get movie on the movie db if api_key is available
    const movieTMDB = configuration.theMovieDb.apiKey
      ? (
        await TheMovieDb(
          TheMovieDbLanguage.FR,
          configuration.theMovieDb.apiKey
        ).search(title)
      )[0]
      : undefined;


    // Merge it with user inputs
    const movie = {
      title: (fill ? movieTMDB?.title : undefined) || title,
      director: director,
      release: release || (fill ? movieTMDB?.release_date : undefined),
      url: url || (fill ? movieTMDB?.poster_full : undefined),
      description: description || (fill ? movieTMDB?.overview : undefined),
    };

    const embed = getEmbedMessage(
      movie.title,
      movie.release,
      movie.description,
      movie.director || undefined,
      movie.url
    )

    // Interaction
    const date = DateTime.now().toFormat("dd LLL yyyy");
    const day = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("today")
        .setLabel("Aujourd'hui : " + date)
        .setStyle("PRIMARY")
        .setDisabled(true),
      new MessageButton()
        .setCustomId("other")
        .setLabel("Autre date")
        .setStyle("SECONDARY")
    );

    await ctx.interaction.reply({
      content: "Vous voulez créer un film",
      embeds: [embed],
      components: [day],
    });
  }
}
