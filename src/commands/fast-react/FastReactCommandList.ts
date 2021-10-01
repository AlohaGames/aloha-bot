import { DiscordOnMessageContext } from "../../DiscordContext";
import { BasicCommand } from "./../BasicCommand";

export class FastReactCommandList extends BasicCommand {
  parse(): BasicCommand {
    return this;
  }

  async execute(ctx: DiscordOnMessageContext): Promise<void> {
    const shortcuts = await ctx.storage.getShortcuts(ctx.message.author.id);

    ctx.message.reply(
      shortcuts.map((s) => `${s.name} : ${s.emojies}`).join("\n")
    );
  }
}
