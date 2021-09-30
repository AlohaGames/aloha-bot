import { PingSlashCommand } from "./PingSlashCommand";
import { expect } from "chai";

describe("PingSlashCommand.register", () => {
  it("Should has correct name", () => {
    const pingSlashCommand = new PingSlashCommand();
    const commandName = "foo";
    expect(pingSlashCommand.register(commandName).name).equal(commandName);
  });

  it("Should has a description", () => {
    const pingSlashCommand = new PingSlashCommand();
    const commandName = "bar";
    expect(pingSlashCommand.register(commandName).description).to.exist;
  });
});
