import { configuration } from "../../../configuration";
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

import { getEmbedMessage } from "./lib/EmbedCreation";
import { getShortFrenchFormatDateNow } from "../../../common/date-utils";
import { CinenssatGetWiewingDate } from "./CinenssatCommandDate";
import { CinenssatInputNote } from "./CinenssatCommandNote";

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
      // exporter function to improve readability
      CinenssatGetWiewingDate(interaction);
      CinenssatInputNote(interaction);

      // other trigger option depending of button selected
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

    // Input option for movie without fill
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
    const date = getShortFrenchFormatDateNow()
    const day = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("today")
        .setLabel("Aujourd'hui : " + date)
        .setStyle("SUCCESS"),
      new MessageButton()
        .setCustomId("other")
        .setLabel("Autre date")
        .setStyle("SECONDARY"),
    );

    await ctx.interaction.reply({
      content: "Vous voulez créer un film",
      embeds: [embed],
      components: [day],
    });
  }
}
