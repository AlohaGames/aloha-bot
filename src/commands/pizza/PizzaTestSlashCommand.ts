import { SlashCommandBuilder } from "@discordjs/builders";
import { DiscordOnInteractionContext } from "../../DiscordContext";
import { BasicSlashCommand } from "../BasicSlashCommand";

export class PizzaTestSlashCommand extends BasicSlashCommand{
    register(name: string): SlashCommandBuilder {
        return new SlashCommandBuilder()
          .setName(name)
          .setDescription("Test du slash pizza");
      }

      async execute(ctx: DiscordOnInteractionContext): Promise<void> {
        ctx.interaction.reply("Je suis le test de la commande /pizza");
      }

}

