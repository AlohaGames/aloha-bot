import { DiscordContext } from "../../DiscordContext";
import { GuildMember, MessageActionRow, MessageButton } from "discord.js";
import { DiscordOnInteractionContext } from "../../DiscordContext";
import { BasicSlashCommand } from "../BasicSlashCommand";
import { SlashCommandBuilder } from "@discordjs/builders";

export class CreateSuicideSlashCommand extends BasicSlashCommand {
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

  onRegister(ctx: DiscordContext): void {
    console.log("Registered command create suicide game");

    ctx.client.on("interactionCreate", async (interaction) => {
      const storage = await ctx.storageManager.getStorage(interaction.guildId);

      // A user play the game
      if (interaction.isButton() && interaction.customId === "play") {
        const user = interaction.user;
        console.log(`User ${user.id} is trying`);

        // Retrieve punish role id
        const guildData = await storage.getGuildData();
        if (!guildData || !guildData.punishRoleId)
          throw new Error("Game not instanciate");

        const value = Math.random();
        if (value > 0.5) {
          const actualScore = await storage.incrementSuicideGame(user.id);
          interaction.reply({
            content: `You win ! You're actual score is ${actualScore}`,
            ephemeral: true,
          });
        } else {
          // Check if role exists
          const punishRoleId = guildData.punishRoleId;
          const role = interaction.guild?.roles.cache.get(punishRoleId);
          if (!role) throw new Error(`Role ${punishRoleId} doest not exists`);

          // Add role to member
          const member = interaction.member as GuildMember;
          member.roles.add(punishRoleId);

          // Reset score
          await storage.resetSuicideGame(user.id);

          interaction.reply({
            content: "You loose ! You're now punished !",
            ephemeral: true,
          });
        }
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
          content:
            "Welcome to the suicide game !\n Click here if you're brave enought.",
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
