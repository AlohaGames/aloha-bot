import { configuration } from "./../configuration";

export function commandNameArgs(
  fullString: string,
  options: { prefixed: boolean } = {
    prefixed: true,
  }
): {
  commandName: string | undefined;
  args: string[];
} {
  const noPrefix = options.prefixed
    ? fullString.slice(configuration.prefix.length)
    : fullString;

  const args = noPrefix.trim().split(/ +/);

  const commandName = args.shift()?.toLowerCase();

  return {
    commandName,
    args,
  };
}
