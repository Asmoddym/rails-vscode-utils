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

const computeFileMetadata = (raw: string) => {
  const parts = raw.split("(");
  const rawPath = parts[0];
  const rawArgs = parts[1]?.split(",") || [];

  let rawPathParts = rawPath.split("/").map((item) => item.replace(/ /g, "_"));
  const rawFileName = rawPathParts.pop() as string;

  if (rawFileName?.includes("_service") && rawPathParts[0] !== "app") {
    rawPathParts = ["app", "services", ...rawPathParts];
  }

  return { fileName: rawFileName, path: rawPathParts, args: rawArgs };
};

export default class BaseGenerator {
  protected attributes: {
    path: string[];
    fileName: string;
    className: string;
    modules: string[];
    args: string[];
  };

  private workspacePath: string;
  private fileSuffix: string;

  constructor(data: string) {
    const { fileName, path, args } = computeFileMetadata(data);

    this.attributes = {
      fileName,
      path, //: path.map((part) => camelToSnakeCase(part.toLowerCase())),
      className: snakeToCamelCase(fileName),
      args,
      modules: path.slice(2),
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

    this.attributes.modules.forEach((namespace: string, i: number) => {
      text += `${"  ".repeat(i)}module ${namespace}\n`;
    });

    const fileContent = this.getFileContent();

    text +=
      fileContent
        .map((line: string) =>
          line.length === 0
            ? ""
            : `${"  ".repeat(this.attributes.modules.length)}${line}`,
        )
        .join("\n") + "\n";

    this.attributes.modules.forEach((_: string, i: number) => {
      text += `${"  ".repeat(this.attributes.modules.length - 1 - i)}end\n`;
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
