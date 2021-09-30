import { BasicCommand } from "../../BasicCommand";
import {
  DiscordContext,
  DiscordOnMessageContext,
} from "../../../DiscordContext";
import {
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";

export class ReactionCommand extends BasicCommand {
  messagesIds: string[];

  constructor() {
    super();
    this.messagesIds = [];
  }

  async onRegister(ctx: DiscordContext): Promise<void> {
    // Init messages ids
    const storages = await ctx.storageManager.getStorages();
    for (const storage of storages) {
      const messageReactId = (await storage.getGuildData())?.messageReactId;
      if (messageReactId) {
        this.messagesIds.push(messageReactId);
      }
    }

    // On reaction to message
    ctx.client.on("messageReactionAdd", async (reaction, user) => {
      if (reaction.partial) {
        try {
          await reaction.fetch();
        } catch (error) {
          return;
        }
      }
      if (this.messagesIds.includes(reaction.message.id)) {
        this.onMessageAction(reaction, user);
      }
    });
  }

  override parse(): ReactionCommand {
    return this;
  }

  override async execute(ctx: DiscordOnMessageContext): Promise<void> {
    const message = await ctx.message.reply("React to this message !");
    const messageReactId = message.id;

    // Send id in array to catch reaction in onRegister
    this.messagesIds.push(messageReactId);

    // Save id in db to keep interaction on bot reload
    ctx.storage?.updateGuildData({ messageReactId });
  }

  onMessageAction(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ): void {
    user.send(`Why do you react this ? ${reaction.emoji.toString()}`);
  }
}
