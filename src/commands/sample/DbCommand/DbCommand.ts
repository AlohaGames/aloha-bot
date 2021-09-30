import { DiscordOnMessageContext } from "../../../DiscordContext";
import { BasicCommand } from "../../BasicCommand";

export class DbCommand extends BasicCommand {
  constructor() {
    super();
  }

  parse(): DbCommand {
    return this;
  }

  async execute(ctx: DiscordOnMessageContext): Promise<void> {
    const { storage } = ctx;
    const data = await storage?.getGuildData();
    const updatedData = await storage?.updateGuildData({
      createdAt: new Date(Date.now()),
    });
    ctx.message.reply(`Data before : ${JSON.stringify(data)}`);
    ctx.message.reply(`Data after : ${JSON.stringify(updatedData)}`);
  }
}
