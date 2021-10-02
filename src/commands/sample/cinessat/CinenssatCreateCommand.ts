import { configuration } from "./../../../configuration";
import { DateTime } from "luxon";
import { SlashCommandBuilder } from "@discordjs/builders";
import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
} from "discord.js";
import { BasicSlashCommand } from "../../BasicSlashCommand";
import { Utils } from "./Utils";
import {
  DiscordContext,
  DiscordOnInteractionContext,
} from "../../../DiscordContext";
import { TheMovieDb, TheMovieDbLanguage } from "./TheMovieDb";

const utils = new Utils();

export class CinenssatCreateCommand extends BasicSlashCommand {
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
    await ctx.client.on("interactionCreate", (interaction) => {
      if (interaction.isButton() && interaction.customId === "other") {
        interaction.update({
          content: "A quelle date ?",
          components: [
            new MessageActionRow().addComponents(
              new MessageSelectMenu()
                .setCustomId("other-day")
                .setPlaceholder("Choisir un date")
                .addOptions(utils.getDateSelectOptions())
            ),
          ],
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

    console.log(movieTMDB);

    // Merge it with user inputs
    const movie = {
      title: (fill ? movieTMDB?.title : undefined) || title,
      director: director,
      release: release || (fill ? movieTMDB?.release_date : undefined),
      url: url || (fill ? movieTMDB?.poster_full : undefined),
      description: description || (fill ? movieTMDB?.overview : undefined),
    };

    const embed = new MessageEmbed()
      .setColor("#C53A41")
      .setAuthor(
        movie.title?.toUpperCase() + (movie.release ? `(${movie.release})` : "")
      );

    if (movie.description) {
      embed.setDescription(`${movie.description}`);
    }

    if (movie.director) {
      embed.setFooter(`Réalisé par ${movie.director}`);
    }

    if (movie.url) {
      embed.setImage(movie.url);
    }

    // Interaction
    const date = DateTime.now().toFormat("dd LLL yyyy");
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
