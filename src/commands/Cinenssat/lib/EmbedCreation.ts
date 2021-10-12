import {EmbedFieldData, MessageEmbed} from "discord.js";

export function getEmbedMessage(
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