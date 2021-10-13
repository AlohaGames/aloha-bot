import { DiscordContext } from "../../DiscordContext";
import { DiscordOnInteractionContext } from "../../DiscordContext";
import { BasicSlashCommand } from "../BasicSlashCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SuicidalScore } from ".prisma/client";
import {
  GuildMember,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";

const DEFAULT_LOOSERATE = 0.1;
const DEFAULT_POINT = 1;
const STEP = 0.05;

export class CreateSuicideSlashCommand extends BasicSlashCommand {
  looserate = DEFAULT_LOOSERATE;
  points = DEFAULT_POINT;

  register(
    name: string
  ): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
    return new SlashCommandBuilder()
      .setName(name)
      .setDescription("Create a suicide game in your discord server !");
  }

  getEmbed(scores: SuicidalScore[]): MessageEmbed {
    const embed = new MessageEmbed()
      .setColor("#C53A41")
      .setAuthor("Leaderboard")
      .setFooter(`Looserate : ${this.looserate}\nPoints : ${this.points}`);

    if (scores.length > 0) {
      embed.setDescription(
        scores
          .sort((s1, s2) => s2.score - s1.score)
          .map((s) => `<@${s.userId}> : ${s.score}`)
          .join("\n")
      );
    } else {
      embed.setDescription("Waiting for players to try");
    }

    return embed;
  }

  onRegister(ctx: DiscordContext): void {
    console.log("Registered command create suicide game");

    ctx.client.on("interactionCreate", async (interaction) => {
      // A user play the game
      if (interaction.isButton() && interaction.customId === "play") {
        // Get storage
        const storage = await ctx.storageManager.getStorage(
          interaction.guildId
        );

        const user = interaction.user;
        console.log(`User ${user.id} is trying`);
        const value = Math.random();

        if (value > this.looserate) {
          await storage.incrementSuicideGame(user.id, this.points);

          // Update looserate
          if (this.looserate < 1) {
            this.looserate = this.looserate + STEP;
            if (this.looserate > 0.5) {
              this.points * 2;
            }
          }
        } else {
          // Reset score

          await storage.resetSuicideGame(user.id);

          // Reset looserate
          this.looserate = DEFAULT_LOOSERATE;
        }

        // Update scores
        const scores = await storage.getSuicideGameScores();
        interaction.update({
          embeds: [this.getEmbed(scores)],
        });
      }
    });
  }

  async execute(ctx: DiscordOnInteractionContext): Promise<void> {
    const member = ctx.interaction.member as GuildMember;
    if (member && member.permissions.has("ADMINISTRATOR")) {
      const actions = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("play")
          .setLabel("SUICIDEZ-MOI !")
          .setStyle("SUCCESS")
      );

      ctx.interaction.reply({
        content: "Welcome to the Suicide Game",
        embeds: [this.getEmbed([])],
        components: [actions],
      });
    } else {
      throw new Error("User is not administrator !");
    }
  }
}
