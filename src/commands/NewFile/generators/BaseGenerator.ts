import * as vscode from "vscode";
import { TextEncoder } from "util";

const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const snakeToCamelCase = (input: string) =>
  input
    .split("_")
    .reduce(
      (res, word, i) =>
        `${res}${word.charAt(0).toUpperCase()}${word.substr(1).toLowerCase()}`,
      "",
    );

export default class BaseGenerator {
  protected attributes: {
    path: string[];
    fileName: string;
    className: string;
    namespaces: string[];
    args: string[];
  };

  private workspacePath: string;
  private fileSuffix: string;

  constructor(data: string) {
    const splittedData = data.split("(");
    let pathParts = splittedData.splice(0, 1).join("").split("::");
    let args: string[] = [];

    if (splittedData.length) {
      const joined = splittedData.join("");
      args = joined.substring(0, joined.length - 1).split(", ");
    }

    const className = snakeToCamelCase(
      pathParts.length === 1
        ? pathParts[0]
        : pathParts.splice(pathParts.length - 1, 1)[0],
    );

    let fileName = camelToSnakeCase(className);
    fileName =
      fileName[0] === "_" ? fileName.substring(1, fileName.length) : fileName;

    this.attributes = {
      fileName,
      className,
      args,
      path: pathParts.map((part) => camelToSnakeCase(part.toLowerCase())),
      namespaces: pathParts.map((part) => snakeToCamelCase(part)),
    };

    this.workspacePath = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0].uri.path
      : "";

    this.fileSuffix = "";

    this.onCreate();
  }

  protected onCreate() {}

  protected getFileContent(): string[] {
    throw new Error("Not implemented");
  }

  public generate() {
    this.createPathDirectory().then(() => {
      this.generateFile();
    });
  }

  protected setPathPrefix(prefix: string) {
    this.attributes.path = prefix
      .split("/")
      .concat(this.attributes.path)
      .flat();
  }

  protected setFileSuffix(suffix: string) {
    this.fileSuffix = suffix;
  }

  // Utils

  private createPathDirectory() {
    return vscode.workspace.fs.createDirectory(
      this.buildFileUri(this.attributes.path.join("/")),
    );
  }

  private generateFile() {
    const filePath =
      this.attributes.path.join("/") +
      "/" +
      this.attributes.fileName +
      this.fileSuffix +
      ".rb";

    const uri = this.buildFileUri(filePath);

    return vscode.workspace.fs
      .writeFile(uri, new TextEncoder().encode(this.buildFileContent()))
      .then(() => this.openFile(uri));
  }

  private buildFileContent(): string {
    let text = "# frozen_string_literal: true\n\n";

    this.attributes.namespaces.forEach((namespace: string, i: number) => {
      text += `${"  ".repeat(i)}module ${namespace}\n`;
    });

    const fileContent = this.getFileContent();

    text +=
      fileContent
        .map((line: string) =>
          line.length === 0
            ? ""
            : `${"  ".repeat(this.attributes.namespaces.length)}${line}`,
        )
        .join("\n") + "\n";

    this.attributes.namespaces.forEach((_: string, i: number) => {
      text += `${"  ".repeat(this.attributes.namespaces.length - 1 - i)}end\n`;
    });

    return text;
  }

  private buildFileUri(path: string) {
    return vscode.Uri.file(this.workspacePath + "/" + path);
  }

  private openFile(uri: vscode.Uri) {
    vscode.commands.executeCommand("vscode.open", uri);
  }
}
