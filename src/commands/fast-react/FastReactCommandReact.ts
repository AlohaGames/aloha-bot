import { deleteMessage } from "../../common/delete-message";
import { DiscordOnMessageContext } from "../../DiscordContext";
import { BasicCommand } from "./../BasicCommand";
import { getCustomEmojiId, isCustomEmoji } from "./lib/custom-emoji";

export class FastReactCommandReact extends BasicCommand {
  shortcutName: string | undefined;

  parse(args: string[]): BasicCommand {
    this.shortcutName = args[0];
    return this;
  }

  async execute(ctx: DiscordOnMessageContext): Promise<void> {
    if (!this.shortcutName) {
      throw new Error("No shortcut name defined");
    }

    const authorId = ctx.message.author.id;
    const messages = await ctx.message.channel.messages.fetch({ limit: 2 });
    const lastMessage = messages.last();

    if (!lastMessage) {
      throw new Error("No last message found");
    }

    await deleteMessage(ctx.message);
    const shortcut = await ctx.storage?.getShortcut(
      this.shortcutName,
      authorId
    );

    if (!shortcut) {
      throw new Error(`No shortcut ${this.shortcutName} found`);
    }

    for (const emoji of JSON.parse(shortcut.emojies)) {
      if (isCustomEmoji(emoji)) {
        await lastMessage.react(getCustomEmojiId(emoji));
      } else {
        await lastMessage.react(emoji);
      }
    }
  }
}
