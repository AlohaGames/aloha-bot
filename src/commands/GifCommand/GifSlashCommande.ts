import { SlashCommandBuilder } from "@discordjs/builders";
import { DiscordOnInteractionContext } from "../../DiscordContext";
import { BasicSlashCommand } from "../BasicSlashCommand";
import { configuration } from "../../configuration";
import axios from 'axios'


export class GifSlashCommand extends BasicSlashCommand {
  register(
    name: string
  ): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
    return new SlashCommandBuilder()
      .setName(name)
      .setDescription("Return a random Gif")
      .addStringOption((option) =>
        option.setName("request").setDescription("request").setRequired(true)
      );
  }

  execute(ctx: DiscordOnInteractionContext): void | Promise<void> {
    // url = "https://g.tenor.com/v1/random?q=" + text + "&key=" + apikey + "&limit=" + 1;
    const url =
      "https://g.tenor.com/v1/search?q=" +
      ctx.interaction.options.getString("request") +
      "&key=" +
      configuration.tenor.apiKey +
      "&limit=" +
      1;
    console.log(url);

    axios.get(url).then((res) => {
      //console.log(data);

      const gifURL = res.data["results"][0]["media"][0]["gif"]["url"];
      ctx.interaction.reply(gifURL);
    });
  }
}
