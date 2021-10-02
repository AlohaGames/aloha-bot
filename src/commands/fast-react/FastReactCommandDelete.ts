import { DiscordOnMessageContext } from "../../DiscordContext";
import { BasicCommand } from "./../BasicCommand";
export class FastReactCommandDelete extends BasicCommand {
  shortcutName: string | undefined;

  parse(args: string[]): BasicCommand {
    this.shortcutName = args[0];
    return this;
  }

  async execute(ctx: DiscordOnMessageContext): Promise<void> {
    if (!this.shortcutName) {
      throw new Error("No shortcut name defined");
    }

    await ctx.storage?.deleteShortcut(this.shortcutName, ctx.message.author.id);

    await ctx.message.author.send(`Shortcut ${this.shortcutName} deleted`);
  }
}
