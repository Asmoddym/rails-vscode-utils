import * as vscode from "vscode";
import { Service, Spec } from "./generators";

export default class NewFile {
  private inputValue: string;

  constructor() {
    this.inputValue = "";
  }

  process(arg?: string) {
    if (arg) {
      const workspacePath = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0].uri.path
      : "";

      this.inputValue = arg.split(workspacePath + "/")[1].split(".rb")[0] + "_spec.rb";
      this.inputValue = this.inputValue.replace("app/", "");
      this.inputValue = this.inputValue.replace("services/", "");

      return this.createFile(); 
    } else {
      let input: vscode.InputBox = vscode.window.createInputBox();

      input.onDidAccept(() => {
        this.inputValue = input.value;
        this.createFile();
        input.hide();
      });

      input.show();
    }
  }

  // PRIVATE

  private createFile() {
    // if (this.shouldGenerateService()) {
    //   return new Service(this.inputValue).generate();
    // }

    if (this.shouldGenerateSpec()) {
      return new Spec(this.inputValue).generate();
    }

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
