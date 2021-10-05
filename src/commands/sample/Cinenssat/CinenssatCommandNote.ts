import { Interaction, MessageActionRow, MessageButton } from "discord.js";
import { getEmbedMessage } from "./lib/EmbedCreation";
import { getActionRow } from "./lib/MessageSection";
import { getNoteSelectOptions } from "./lib/Utils";

export async function CinenssatInputNote(interaction: Interaction): Promise<void> {
  // print the note of the user who's react to the bot
  if (interaction.isSelectMenu() && interaction.customId === "note") {
    const note = interaction.values[0]
    const old_embed = interaction.message.embeds[0];

    // get old note field
    const fields = old_embed.fields
    let existingNoteField = false
    fields?.forEach(field => {
      // if the note field exist, put it on plural and adding the new note
      if (field.name.includes("Note")) {
        existingNoteField = true
        field.name = "Notes attribuées"
        field.value = field.value + "\n" + "<@" + interaction.user.id + "> : " + note + "/10"
      }
    })

    const embed = getEmbedMessage(
      old_embed.author?.name || "Unknow",
      undefined,
      old_embed.description || undefined,
      old_embed.footer?.text,
      old_embed.image?.url,
      old_embed.fields
    )

    // if the note field doesn't exist, create it
    if (!existingNoteField) {
      embed.addField("Note attribuée", "<@" + interaction.user.id + "> : " + note + "/10", true)
    }

    await interaction.update({
      content: null,
      embeds: [embed],
      components: [
        // adding close option "after" one note, to be sure each film could be get one note
        getActionRow("note", "Quelle note lui donnes-tu ?", getNoteSelectOptions()),
        new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("close")
            .setLabel("Clôture des notes")
            .setStyle("DANGER")
        )
      ]
    });
  }
}