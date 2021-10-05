import {
  MessageActionRow,
  MessageEditOptions, MessageSelectMenu,
  MessageSelectOptionData
} from "discord.js";

export function getMenuSelection(
  content: string,
  customId: string,
  placeholder: string,
  option: MessageSelectOptionData[]): MessageEditOptions {
  return {
    content: content,
    components: [
      getActionRow(customId, placeholder, option)
    ],
  }
}

export function getActionRow(
  customId: string,
  placeholder: string,
  option: MessageSelectOptionData[]): MessageActionRow {
  return new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId(customId)
      .setPlaceholder(placeholder)
      .addOptions(option)
  )
}