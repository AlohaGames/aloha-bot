import { Message } from "discord.js";

export async function deleteMessage(message: Message): Promise<void> {
  if (message.channel.type !== "DM") {
    await message.delete();
  }
}
