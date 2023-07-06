import * as vscode from "vscode";
import { Model, Class, Service } from "./generators";

export default class NewFile {
  private inputValue: string;
  private path: string;
  private classType: string;

  constructor() {
    this.inputValue = "";
    this.path = "";
    this.classType = "";
  }

  process() {
    let input: vscode.InputBox = vscode.window.createInputBox();

    input.onDidAccept(() => {
      this.inputValue = input.value;
      this.createClass();
      input.hide();
    });

    input.show();
  }

  // PRIVATE

  private createClass() {
    this.parseInput();

    switch (this.classType) {
      case "model":
      case "m":
        new Model(this.path).generate();
      case "service":
      case "s":
        new Service(this.path).generate();
      case "class":
      case "c":
      default:
        new Class(this.path).generate();
    }
  }

  private parseInput() {
    const parts = this.inputValue.split(" ");

    const classType = parts.length === 1 ? "class" : parts[0];

    this.classType = classType;
    this.path = parts[parts.length - 1];
  }
}
