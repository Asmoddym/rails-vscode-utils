import * as vscode from "vscode";

export function getCurrentDocumentExtension() {
  const document = vscode.window.activeTextEditor?.document;
  return document?.fileName?.split(".")?.pop();
}
