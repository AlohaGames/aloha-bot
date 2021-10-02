import { deleteMessage } from "../../common/delete-message";
import { DiscordOnMessageContext } from "../../DiscordContext";
import { BasicCommand } from "./../BasicCommand";
import unicodeAlphabet from "./lib/unicode-alphabet";

export class FastReactCommandWrite extends BasicCommand {
  text: string | undefined;

  parse(args: string[]): BasicCommand {
    this.text = args[0]?.toLocaleLowerCase();
    return this;
  }

  async execute(ctx: DiscordOnMessageContext): Promise<void> {
    if (!this.text) {
      throw new Error("No text defined");
    }
    const messages = await ctx.message.channel.messages.fetch({ limit: 2 });
    await deleteMessage(ctx.message);
    const lastMessage = messages.last();
    if (!lastMessage) {
      throw new Error("No message to react to !");
    }
    for (const c of this.text) {
      lastMessage.react(unicodeAlphabet[c]);
    }
  }
}
