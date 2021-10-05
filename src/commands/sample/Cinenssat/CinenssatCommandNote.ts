import { Interaction, MessageActionRow, MessageButton } from "discord.js";
import { getEmbedMessage } from "./lib/EmbedCreation";
import { getActionRow } from "./lib/MessageSection";
import { getNoteSelectOptions } from "./lib/Utils";
import {DiscordContext} from "../../../DiscordContext";

export async function CinenssatInputNote(
  interaction: Interaction,
  ctx: DiscordContext): Promise<void> {
  // print the note of the user who's react to the bot
  if (interaction.isSelectMenu() && interaction.customId === "note") {
    const note = interaction.values[0]
    const old_embed = interaction.message.embeds[0];

    const storage = await ctx.storageManager.getStorage(interaction.guildId);
    const movie = await storage.getMovie(
      old_embed.author?.name ? old_embed.author?.name.toLowerCase().slice(0, -13) : "unknow",
      interaction.guildId || "mp"
    )

    await storage.createOrUpdateNote(
      interaction.user.id,
      parseFloat(note),
      "ras",
      movie.id);

    const notes = await storage.getNoteForAFilm(movie.id);

    // get old note field
    const fields = old_embed.fields
    let existingNoteField = false
    fields?.forEach(field => {
      // if the note field exist, put it on plural and adding the new note
      if (field.name.includes("Note")) {
        existingNoteField = true
        field.name = notes.length > 1 ? "Notes attribuées" : "Note attribuée";
        field.value = "empty";
        notes.forEach(note => {
          if (field.value === "empty") {
            field.value = "<@" + note.authorId + "> : " + note.note + "/10";
          } else {
            field.value = field.value + "\n<@" + note.authorId + "> : " + note.note + "/10";
          }
        })
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
      embed.addField("Note attribuée", "No note for now")
      embed.fields?.forEach(field => {
        if (field.name.includes("Note")) {
          field.name = notes.length > 1 ? "Notes attribuées" : "Note attribuée";
          notes.forEach(note => {
            field.value = "<@" + note.authorId + "> : " + note.note + "/10";
          })
        }
      })
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