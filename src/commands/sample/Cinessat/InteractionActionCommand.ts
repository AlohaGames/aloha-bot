import {
  MessageActionRow,
  MessageEditOptions,
  MessageEmbed,
  MessageSelectMenu,
  MessageSelectOptionData
} from "discord.js";

export class InteractionActionCommand {
  getMenuSelection(
    content: string,
    customId: string,
    placeholder: string,
    option: MessageSelectOptionData[]): MessageEditOptions {
    return {
      content: content,
      components: [
        new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId(customId)
            .setPlaceholder(placeholder)
            .addOptions(option)
        ),
      ],
    }
  }

  getEmbedMessage(
    title: string,
    release?: string,
    description?: string,
    director?: string,
    url?: string): MessageEmbed {
    const embed = new MessageEmbed()
      .setColor("#C53A41")
      .setAuthor(title?.toUpperCase() + (release ? ` (${release})` : ""));

    if (description) {
      embed.setDescription(description);
    }

    if (director) {
      embed.setFooter(`Réalisé par ${director}`)
    }

    if (url) {
      embed.setImage(url)
    }

    return embed
  }
}