import * as dotenv from "dotenv";
dotenv.config();

export interface BotConfiguration {
  discord: {
    name: string;
    token: string;
    applicationId: string;
  };
  prefix: string;
  dev: {
    guildsId: string[];
  };
  theMovieDb: {
    apiKey?: string;
  };
  tenor: {
    apiKey?: string;
  }
}

if (!process.env.DISCORD_TOKEN) {
  throw new Error("No env variable DISCORD_TOKEN defined.");
}
if (!process.env.DISCORD_APPLICATION_ID) {
  throw new Error("No env variable DISCORD_APPLICATION_ID defined.");
}

export const configuration: BotConfiguration = {
  discord: {
    name: process.env.DISCORD_NAME || "Your application",
    token: process.env.DISCORD_TOKEN,
    applicationId: process.env.DISCORD_APPLICATION_ID,
  },
  prefix: process.env.PREFIX || "!prefix",
  dev: {
    guildsId: parseStringArray(process.env.DEV_GUILD_ID),
  },
  theMovieDb: {
    apiKey: process.env.API_KEY,
  },
  tenor: {
    apiKey: process.env.TENOR_KEY,
  }
};

function parseStringArray(stringArray: string | undefined) {
  if (!stringArray) return [];
  return stringArray.split(",");
}
