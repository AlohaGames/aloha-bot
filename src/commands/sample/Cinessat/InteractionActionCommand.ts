import {
  EmbedFieldData,
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
        this.getActionRow(customId, placeholder, option)
      ],
    }
  }

  getActionRow(customId: string, placeholder: string, option: MessageSelectOptionData[]): MessageActionRow{
    return new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId(customId)
        .setPlaceholder(placeholder)
        .addOptions(option)
    )
  }

  getEmbedMessage(
    title: string,
    release?: string,
    description?: string,
    director?: string,
    url?: string,
    fields?: EmbedFieldData[]): MessageEmbed {
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

    if(fields) {
      embed.setFields(fields)
    }

    return embed
  }
}