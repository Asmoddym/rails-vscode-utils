import * as vscode from "vscode";

import NewFile from "./commands/NewFile";

export function activate(context: vscode.ExtensionContext) {
  vscode.workspace.onWillSaveTextDocument(() => {
    const document = vscode.window.activeTextEditor?.document;
    const documentContent = document?.getText();
    const extension = document?.fileName?.split(".")?.pop();

    if (
      extension === "rb" &&
      !documentContent?.includes("# frozen_string_literal: true")
    ) {
      vscode.window.activeTextEditor?.edit((editor) => {
        editor.insert(
          new vscode.Position(0, 0),
          "# frozen_string_literal: true\n\n",
        );
      });
    }
  });

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
