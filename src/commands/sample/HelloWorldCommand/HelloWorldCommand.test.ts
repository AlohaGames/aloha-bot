import { HelloWorldCommand } from "./HelloWorldCommand";
import { expect } from "chai";

describe("HelloWorldCommand.parse", () => {
  it("Should has no name", () => {
    const helloCommand = new HelloWorldCommand();
    helloCommand.parse([]);
    expect(helloCommand.name).equal(undefined);
  });

  it("Name should be parsed", () => {
    const helloCommand = new HelloWorldCommand();
    helloCommand.parse(["John Dodo"]);

    expect(helloCommand.name).equal("John Dodo");
  });

  it("Should not have been parsed", () => {
    const helloCommand = new HelloWorldCommand();
    expect(helloCommand.name).equal(undefined);
  });
});

describe("HelloWorldCommand.sayHello", () => {
  it("Should say hello to World", () => {
    const helloCommand = new HelloWorldCommand();
    expect(helloCommand.parse([]).sayHello()).equal("Hello World!");
  });
  it("Should say hello to John Doe", () => {
    const helloCommand = new HelloWorldCommand();
    expect(helloCommand.parse(["John Doe"]).sayHello()).equal(
      "Hello John Doe!"
    );
  });
});
