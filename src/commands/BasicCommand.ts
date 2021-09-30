import { DiscordContext, DiscordOnMessageContext } from "./../DiscordContext";

// Class and interface merging :
// https://stackoverflow.com/questions/44153378/typescript-abstract-optional-method

export interface BasicCommand {
  onRegister?(ctx: DiscordContext): void;
}

export abstract class BasicCommand {
  abstract parse(args: string[]): BasicCommand;

  // This method is async
  abstract execute(ctx: DiscordOnMessageContext): Promise<void>;
}
