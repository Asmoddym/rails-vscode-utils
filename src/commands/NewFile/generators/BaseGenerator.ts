import * as vscode from "vscode";
import { TextEncoder } from "util";
import snakeToCamelCase from "../../../helpers/snakeToCamelCase";

export default class BaseGenerator {
  protected rawInput: string;

  protected attributes: {
    path: string[];
    fileName: string;
    className: string;
    modules: string[];
    args: string[];
  };

  private workspacePath: string;

  constructor(data: string) {
    this.rawInput = data;

    const { fileName, path, args } = this.computeFileMetadata(data);

    this.attributes = {
      fileName,
      path,
      className: snakeToCamelCase(fileName.split(".rb")[0]),
      args,
      modules: (path[1] === "services" ? path.slice(2) : path).map((item) => snakeToCamelCase(item))
    };

    this.workspacePath = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0].uri.path
      : "";

    this.onCreate();
  }

  protected onCreate() {}

  protected getFileContent(): string[] {
    throw new Error("Not implemented");
  }

  protected getFileHeaders(): string[] { return []; }

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

  // Utils

  private createPathDirectory() {
    return vscode.workspace.fs.createDirectory(
      this.buildFileUri(this.attributes.path.join("/")),
    );
  }

  private generateFile() {
    const filePath =
      this.attributes.path.join("/") + "/" + this.attributes.fileName;

    const uri = this.buildFileUri(filePath);

    return vscode.workspace.fs
      .writeFile(uri, new TextEncoder().encode(this.buildFileContent()))
      .then(() => this.openFile(uri));
  }

  private buildFileContent(): string {
    let text = "# frozen_string_literal: true\n\n";

    if (this.getFileHeaders().length > 0) {
      text += this.getFileHeaders().join("\n") + "\n\n";
    }

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

  // Parsing

  private computeFileMetadata = (raw: string) => {
    const parts = raw.split("(");
    const rawPath = parts[0];
    const rawArgs =
      parts[1]?.split(",")?.map((item) => item.replace(/[\) ]/g, "")) || [];

    let rawPathParts = rawPath.split("/").map((item) => item.replace(/ /g, "_"));
    const rawFileName = rawPathParts.pop() as string;
    const fileName = rawFileName.includes(".rb")
      ? rawFileName
      : `${rawFileName}.rb`;

    return { fileName, path: rawPathParts, args: rawArgs };
  };
}
