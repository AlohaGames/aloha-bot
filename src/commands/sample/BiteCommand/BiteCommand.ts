import { DiscordOnMessageContext } from "../../../DiscordContext";
import { BasicCommand } from "../../BasicCommand";

export class BiteCommand extends BasicCommand {
  vergeSize: string | undefined;

  constructor() {
    super();
  }

  override parse(args: string[]): BiteCommand {
    if (args.length > 0) {
      this.vergeSize = args[0];
    }
    return this;
  }

  override async execute(ctx: DiscordOnMessageContext): Promise<void> {

    if(this.vergeSize == "saint-valentin") {
      ctx.message.reply("https://www.youtube.com/watch?v=PRzKsIiOVkE");
    } else if(this.vergeSize == "draw") {
      ctx.message.reply("https://seoi.net/penint/");
    } else if(isNaN(Number(this.vergeSize))) {
      ctx.message.reply(`http://en.inkei.net/${this.vergeSize}`);
    } else {
      ctx.message.reply(this.sendBite());
    }
  }

  sendBite(): string {    
    if (this.vergeSize == undefined) {
      return `8==D💦`;
    }

    let vergeString = new String("");
    for (let i = 0; i < +this.vergeSize; i++) {
      vergeString += "="
    }
    return `8${vergeString}D💦`;
  }
}
