import { REST } from "@discordjs/rest";
import { Client, Intents } from "discord.js";
import { CommandManager } from "./commands/CommandManager";
import { configuration } from "./configuration";
import { HelloWorldCommand } from "./commands/sample/HelloWorldCommand/HelloWorldCommand";
import { DbCommand } from "./commands/sample/DbCommand/DbCommand";
import { ReactionCommand } from "./commands/sample/ReactionCommand/ReactionCommand";
import { CommandSlashManager } from "./commands/CommandSlashManager";
import { PingSlashCommand } from "./commands/sample/PingSlashCommand/PingSlashCommand";
import { TimeHelperSlashCommand } from "./commands/sample/TimeHelperSlashCommand/TimeHelperSlashCommand";
import { ContextManager } from "./ContextManager";
import { registerSlashCommands } from "./register-slash-commands";
import { PizzaCommand } from "./commands/pizza/PizzaCommand";

// https://discord.com/developers/docs/topics/gateway
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

const rest = new REST({ version: "9" }).setToken(configuration.discord.token);
const commandManager = new CommandManager();
const commandSlashManager = new CommandSlashManager();
const contextManager = new ContextManager(client);

// Register Bot commands
commandManager.registerCommand(
  contextManager.getDiscordContext(),
  "hello",
  new HelloWorldCommand()
);
commandManager.registerCommand(
  contextManager.getDiscordContext(),
  "db",
  new DbCommand()
);
commandManager.registerCommand(
  contextManager.getDiscordContext(),
  "react",
  new ReactionCommand()
);

// Register Slash commands in Manager
commandSlashManager.registerCommand(
  contextManager.getDiscordContext(),
  "ping",
  new PingSlashCommand()
);
commandSlashManager.registerCommand(
  contextManager.getDiscordContext(),
  "timer-helper",
  new TimeHelperSlashCommand()
);

commandSlashManager.registerCommand(
  contextManager.getDiscordContext(),
  "pizza",
  new PizzaCommand()
)

// Register Slash commands at Discord from the manager
registerSlashCommands(rest, commandSlashManager, [
  ...configuration.dev.guildsId,
]);

client.on("interactionCreate", (interaction) => {
  if (interaction.isCommand()) {
    commandSlashManager.executeCommand(
      contextManager.getDiscordOnInteractionContext(interaction),
      interaction.commandName
    );
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  // Set bot status
  client.user?.setActivity({ name: configuration.discord.name });
});

// On message received
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(configuration.prefix) || message.author.bot)
    return;

  const args = message.content
    .slice(configuration.prefix.length)
    .trim()
    .split(/ +/);

  const commandName = args.shift()?.toLowerCase();

  const ctx = await contextManager.getDiscordOnMessageContext(message);

  await commandManager.executeCommand(ctx, commandName, args);
});

// Login with Discord bot token
client.login(configuration.discord.token);
