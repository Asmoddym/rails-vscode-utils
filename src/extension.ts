import * as vscode from "vscode";

import NewFile from "./commands/NewFile";

export function activate(context: vscode.ExtensionContext) {
  vscode.workspace.onWillSaveTextDocument(() => {});

  const disposables = [
    vscode.commands.registerCommand("rails-vscode-utils.newFile", () => {
      new NewFile().process();
    }),
  ];

  disposables.forEach((disposable) => {
    context.subscriptions.push(disposable);
  });
}

export function deactivate() {}
