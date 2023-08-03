import * as vscode from "vscode";

export function rubyHook() {
  const document = vscode.window.activeTextEditor?.document;
  const documentContent = document?.getText();

  if (!documentContent?.includes("# frozen_string_literal: true")) {
    vscode.window.activeTextEditor?.edit((editor) => {
      editor.insert(
        new vscode.Position(0, 0),
        "# frozen_string_literal: true\n\n",
      );
    });
  }
}
