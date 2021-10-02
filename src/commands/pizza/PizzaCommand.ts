import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageSelectMenu } from "discord.js";
import { BasicSlashCommand } from "../BasicSlashCommand";
import {
    DiscordContext,
    DiscordOnInteractionContext,
  } from "../../DiscordContext";

import {MessageEmbed} from 'discord.js'
import { pizzasList } from "./pizzas-list";

export class PizzaCommand extends BasicSlashCommand{
    register(name: string): SlashCommandBuilder {
        return new SlashCommandBuilder()
          .setName(name)
          .setDescription("Test du slash pizza");
      }

      async onRegister(ctx: DiscordContext): Promise<void> {
        console.log("Registered command time helper");
        ctx.client.on("interactionCreate", async (interaction) => {
          if (interaction.isSelectMenu() && interaction.customId === "pizza") {
            if (interaction.values[0] === "pizza-test") {
                console.log("coucou")
              interaction.reply("suce ma bite pour la saint-valentin")
            }else if(interaction.values[0] === "pizza-list"){
                const message = new MessageEmbed()
                .setColor('#7855df')
                .setDescription("Liste des pizzas")
                .setTitle("Liste des pizzas de ARWAN")
                .setURL("https://www.ar-rwan-pizza.fr/")
                .setImage("https://www.ar-rwan-pizza.fr/img/style/logo.png")
                .setDescription("Téléphone: 02 96 46 14 14")
                .setFooter("Demandez les pizzas coupées au besoin !")

                const pizzas = pizzasList;

                console.log(pizzas)

                for(const pizza of Object.values(pizzas)){
                    console.log(pizza)

                    message.addField(pizza.name.toString(), "Ingrédients: " + pizza.ingredients.join(', ')
                 + "\nPrix Taille 26: " + pizza.prix_26 + "\nPrix Taille 33: " + pizza.prix_33)
                }



                interaction.reply({content: "Voici la liste des pizzas disponibles :)", embeds: [message]})


            }

          }
        });
      }

      async execute(ctx: DiscordOnInteractionContext): Promise<void> {
        //ctx.interaction.reply("Je suis le test de la commande /pizza");

        const menuTestPizza = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId("pizza")
                .setPlaceholder("Menu de commande de pizza !")
                .addOptions([
                    {
                        label: "test",
                        description: "juste un test",
                        value: "pizza-test"
                    },
                    {
                        label: "list",
                        description: "Liste les pizzas",
                        value: "pizza-list"
                    },
                    {
                      label: "add",
                      description: "Ajouter une pizza à la commande",
                      value: "pizza-add"
                    }
                ])
        )


        await ctx.interaction.reply({
            content: "Here we go",
            components: [menuTestPizza],
          });
      };

}

