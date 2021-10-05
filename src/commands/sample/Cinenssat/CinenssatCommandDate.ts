import { Interaction } from "discord.js";
import { getShortFrenchFormatDateNow } from "../../../common/date-utils";
import { getEmbedMessage } from "./lib/EmbedCreation";
import {getActionRow, getMenuSelection} from "./lib/MessageSection";
import {getDateSelectOptions, getNoteSelectOptions} from "./lib/Utils";

export async function CinenssatGetWiewingDate(interaction: Interaction): Promise<void> {
  // list 15 days (and today, if it's a missing) to select the viewing date
  if (interaction.isButton() && interaction.customId === "other") {
    await interaction.update(getMenuSelection(
      "A quelle date ?",
      "other-day",
      "Choisir une date",
      getDateSelectOptions())
    );
  }

  // Then catch the date and print it on an embed
  if ((interaction.isButton() && interaction.customId === "today") ||
    (interaction.isSelectMenu() && interaction.customId === "other-day")) {
    let date = getShortFrenchFormatDateNow();
    if (interaction.isSelectMenu() && interaction.customId === "other-day") {
      date = interaction.values[0];
    }
    const old_embed = interaction.message.embeds[0];
    const embed = getEmbedMessage(
      old_embed.author?.name || "Unknow",
      undefined,
      old_embed.description || undefined,
      old_embed.footer?.text,
      old_embed.image?.url,
      undefined
    )

    embed.addField("Date de visionnage sur " + interaction.guild?.name, date)

    await interaction.update({
      content: null,
      embeds: [embed],
      components: [getActionRow("note", "Quelle note lui donnes-tu ?", getNoteSelectOptions())]
    });
  }
}