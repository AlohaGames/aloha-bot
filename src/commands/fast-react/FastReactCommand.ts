import { FastReactCommandList } from "./FastReactCommandList";
import { FastReactCommandDelete } from "./FastReactCommandDelete";
import { FastReactCommandReact } from "./FastReactCommandReact";
import { FastReactCommandWrite } from "./FastReactCommandWrite";
import { DiscordContext } from "./../../DiscordContext";
import { FastReactCommandCreate } from "./FastReactCommandCreate";
import { commandNameArgs } from "../../common/command-name-args";
import { DiscordOnMessageContext } from "../../DiscordContext";
import { BasicCommand } from "./../BasicCommand";
import { CommandManager } from "./../CommandManager";

export class FastReactCommand extends BasicCommand {
  subCommandManager = new CommandManager();

  commandName: string | undefined;
  subArgs: string[] | undefined;

  onRegister(ctx: DiscordContext): void {
    this.subCommandManager.registerCommand(
      ctx,
      "create",
      new FastReactCommandCreate()
    );
    this.subCommandManager.registerCommand(
      ctx,
      "write",
      new FastReactCommandWrite()
    );
    this.subCommandManager.registerCommand(
      ctx,
      "react",
      new FastReactCommandReact()
    );
    this.subCommandManager.registerCommand(
      ctx,
      "delete",
      new FastReactCommandDelete()
    );
    this.subCommandManager.registerCommand(
      ctx,
      "list",
      new FastReactCommandList()
    );
  }

  parse(args: string[]): BasicCommand {
    const { commandName, args: subArgs } = commandNameArgs(args.join(" "), {
      prefixed: false,
    });
    this.commandName = commandName;
    this.subArgs = subArgs;
    return this;
  }

  execute(ctx: DiscordOnMessageContext): void {
    if (!this.commandName || !this.subArgs) {
      throw new Error(`No commands or args defined`);
    }
    this.subCommandManager.executeCommand(ctx, this.commandName, this.subArgs);
  }
}
