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
const STEP = 0.05;

export class CreateSuicideSlashCommand extends BasicSlashCommand {
  looserate = DEFAULT_LOOSERATE;

  register(
    name: string
  ): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
    return new SlashCommandBuilder()
      .setName(name)
      .setDescription("Create a suicide game in your discord server !")
      .addRoleOption((option) =>
        option
          .setName("punish-role")
          .setDescription("Role the user will be added to be punished")
          .setRequired(true)
      );
  }

  getEmbed(scores: SuicidalScore[]) {
    const embed = new MessageEmbed()
      .setColor("#C53A41")
      .setAuthor("Leaderboard")
      .setFooter(`Looserate : ${this.looserate}`);

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

        // Retrieve punish role id
        const guildData = await storage.getGuildData();
        if (!guildData || !guildData.punishRoleId)
          throw new Error("Game not instanciate");
        const punishRoleId = guildData.punishRoleId;

        // If user already punish
        /* 
        const member = interaction.member as GuildMember;
        if (member.roles.cache.find((r) => r.id === punishRoleId)) {
          interaction.reply({
            content: "You are already punish !",
            ephemeral: true,
          });
          return;
        } 
        */

        const user = interaction.user;
        console.log(`User ${user.id} is trying`);
        const value = Math.random();

        if (value > this.looserate) {
          await storage.incrementSuicideGame(user.id);

          // Update looserate
          if (this.looserate < 1) {
            this.looserate = this.looserate + STEP;
          }
        } else {
          // Check if role exists
          const role = interaction.guild?.roles.cache.get(punishRoleId);
          if (!role) throw new Error(`Role ${punishRoleId} doest not exists`);

          // Add role to member
          const member = interaction.member as GuildMember;
          member.roles.add(punishRoleId);

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
      const punishRoleId = ctx.interaction.options.getRole("punish-role")?.id;
      if (punishRoleId) {
        // Save punish role for later
        const storage = await ctx.storageManager.getStorage(
          ctx.interaction.guildId
        );
        await storage.updateGuildData({
          punishRoleId,
        });
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
        throw new Error("No punish role");
      }
    } else {
      throw new Error("User is not administrator !");
    }
  }
}
