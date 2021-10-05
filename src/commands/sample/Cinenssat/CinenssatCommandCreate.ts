import { configuration } from "../../../configuration";
import { SlashCommandBuilder } from "@discordjs/builders";
import {
  GuildMember,
  MessageActionRow,
  MessageButton,
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
      CinenssatGetWiewingDate(interaction, ctx);
      CinenssatInputNote(interaction, ctx);

      // other trigger option depending of button selected
      if (interaction.isButton() && interaction.customId === "close") {
        const member = interaction.member as GuildMember;
        if (member.permissions.has("ADMINISTRATOR")) {
          interaction.update({
            components: [],
          });
        } else {
          interaction.user.send("No right to close this");
        }
      }
    });
  }

  async execute(ctx: DiscordOnInteractionContext): Promise<void> {
    // Input option for movie without fill
    const title = ctx.interaction.options.getString("title", true);
    const director = ctx.interaction.options.getString("director");

    // Get movie on the movie db if api_key is available
    const movieTMDB = configuration.theMovieDb.apiKey
      ? (
          await TheMovieDb(
            TheMovieDbLanguage.FR,
            configuration.theMovieDb.apiKey
          ).search(title)
        )[0]
      : undefined;

    const storage = await ctx.storageManager.getStorage(
      ctx.interaction.guildId
    );

    // Merge it with user inputs
    const movie = await storage.createMovies(
      ctx.interaction.guild?.id || "dm",
      movieTMDB?.title.toLowerCase() || title,
      undefined,
      director || undefined,
      movieTMDB?.release_date || undefined, // @TODO update for french format with luxon
      movieTMDB?.poster_full || undefined
    ); //*/

    const embed = getEmbedMessage(
      movie.title,
      movie.release || undefined,
      movieTMDB?.overview || undefined,
      movie.director || undefined,
      movie.poster || undefined
    );

    // Interaction
    const date = getShortFrenchFormatDateNow();
    const day = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("today")
        .setLabel("Aujourd'hui : " + date)
        .setStyle("SUCCESS"),
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
