import { isUnicode } from "./lib/is-unicode";
import { DiscordOnMessageContext } from "../../DiscordContext";
import { BasicCommand } from "./../BasicCommand";
import { isCustomEmoji } from "./lib/custom-emoji";

export class FastReactCommandCreate extends BasicCommand {
  name: string | undefined;
  emojies: string[] | undefined;

  parse(args: string[]): BasicCommand {
    this.name = args.shift();
    this.emojies = args.filter((e) => isUnicode(e) || isCustomEmoji(e));
    return this;
  }

  async execute(ctx: DiscordOnMessageContext): Promise<void> {
    ctx.message.author.send(`Shortcut created  : ${this.emojies}`);
    if (!this.emojies || !this.name) {
      throw new Error("No name or emojies defined");
    }
    const shortcut = await ctx.storage?.createShortcut(
      this.name,
      ctx.message.author.id,
      this.emojies
    );
    ctx.message.author.send(
      `Shortcut ${shortcut?.name} created : ${shortcut?.emojies}`
    );
  }
}
