import * as vscode from "vscode";
import { TextEncoder } from "util";

const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

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

    const className =
      pathParts.length === 1
        ? pathParts[0]
        : pathParts.splice(pathParts.length - 1, 1)[0];

    let fileName = camelToSnakeCase(className);
    fileName =
      fileName[0] === "_" ? fileName.substring(1, fileName.length) : fileName;

    this.attributes = {
      fileName,
      className,
      args,
      path: pathParts.map((part) => part.toLowerCase()),
      namespaces: pathParts,
    };

    this.workspacePath = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0].uri.path
      : "";

    this.fileSuffix = "";

    this.onCreate();
  }

  protected onCreate() {}
  protected setNamespaces(namespaces: string[]) {
    this.attributes.namespaces = namespaces;
  }
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
        .map(
          (line: string) =>
            `${"  ".repeat(this.attributes.namespaces.length)}${line}`,
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
