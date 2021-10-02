import { DiscordContext, DiscordOnMessageContext } from "./../DiscordContext";
import { BasicCommand } from "./BasicCommand";

export class CommandManager {
  commands: Record<string, BasicCommand>;

  constructor() {
    this.commands = {};
  }

  registerCommand(
    ctx: DiscordContext,
    commandName: string,
    command: BasicCommand
  ): void {
    this.commands[commandName] = command;
    if (command.onRegister) {
      command.onRegister(ctx);
    }
  }

  async executeCommand(
    ctx: DiscordOnMessageContext,
    commandName: string | undefined,
    args: string[]
  ): Promise<void> {
    if (!commandName) {
      throw new Error(`No command name!`);
      return;
    }

    const command = this.commands[commandName];
    if (!command) {
      throw new Error(`No command with name ${commandName}`);
      return;
    }

    await command.parse(args).execute(ctx);
  }
}
