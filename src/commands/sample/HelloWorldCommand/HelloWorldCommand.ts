import { DiscordOnMessageContext } from "../../../DiscordContext";
import { BasicCommand } from "../../BasicCommand";

export class HelloWorldCommand extends BasicCommand {
  name: string | undefined;

  constructor() {
    super();
  }

  override parse(args: string[]): HelloWorldCommand {
    if (args.length > 0) {
      this.name = args[0];
    }
    return this;
  }

  override async execute(ctx: DiscordOnMessageContext): Promise<void> {
    ctx.message.reply(this.sayHello());
  }

  sayHello(): string {
    return `Hello ${this.name || "World"}!`;
  }
}
