import * as vscode from "vscode";
import { Model, Class, Service } from "./generators";

export default class NewFile {
  private inputValue: string;

  constructor() {
    this.inputValue = "";
  }

  process() {
    let input: vscode.InputBox = vscode.window.createInputBox();

    input.onDidAccept(() => {
      this.inputValue = input.value;
      this.createFile();
      input.hide();
    });

    input.show();
  }

  // PRIVATE

  private createFile() {
    if (this.shouldGenerateModel()) {
      return new Model(this.inputValue).generate();
    }

    if (this.shouldGenerateService()) {
      return new Service(this.inputValue).generate();
    }

    return new Class(this.inputValue).generate();
  }

  private shouldGenerateModel() {
    return this.inputValue.toLowerCase().includes("model");
  }

  private shouldGenerateService() {
    return this.inputValue.toLowerCase().includes("service");
  }
}
