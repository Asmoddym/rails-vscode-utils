import * as vscode from "vscode";
import { Service } from "./generators";

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
    // if (this.shouldGenerateService()) {
    //   return new Service(this.inputValue).generate();
    // }

    return new Service(this.inputValue).generate();
  }

  private shouldGenerateSpec() {
    return this.inputValue.toLowerCase().includes("_spec");
  }

  // private shouldGenerateService() {
  //   return (
  //     this.inputValue.toLowerCase().includes("_service") &&
  //     !this.shouldGenerateSpec()
  //   );
  // }
}
