import { BasicSlashCommand } from "./BasicSlashCommand";
import {
  DiscordContext,
  DiscordOnInteractionContext,
} from "./../DiscordContext";

export class CommandSlashManager {
  commands: Record<string, BasicSlashCommand>;

  constructor() {
    this.commands = {};
  }

  // eslint-disable-next-line
  getCommandsJSON() {
    return Object.entries(this.commands).map(([key, value]) =>
      value.register(key).toJSON()
    );
  }

  registerCommand(
    ctx: DiscordContext,
    commandName: string,
    command: BasicSlashCommand
  ): void {
    this.commands[commandName] = command;
    if (command.onRegister) {
      command.onRegister(ctx);
    }
  }

  async executeCommand(
    ctx: DiscordOnInteractionContext,
    commandName: string | undefined
  ): Promise<void> {
    if (!commandName) throw new Error("No command name!");
    const command = this.commands[commandName];

    if (!command) {
      throw new Error(`No command with name ${commandName}`);
    }
    await command.execute(ctx);
  }
}
