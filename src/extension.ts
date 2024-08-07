import * as vscode from "vscode";

import NewFile from "./commands/NewFile";

import { rubyHook } from "./saveHooks/ruby";

import { getCurrentDocumentExtension } from "./helpers";

export function activate(context: vscode.ExtensionContext) {
  // vscode.workspace.onWillSaveTextDocument(() => {
  //   if (getCurrentDocumentExtension() === "rb") {
  //     rubyHook();
  //   }
  // });

  const disposables = [
    vscode.commands.registerCommand("rails-vscode-utils.newFile", () => {
      new NewFile().process();
    }),

    vscode.commands.registerCommand("rails-vscode-utils.newAssociatedSpec", (...args) => {
      new NewFile().process(args[0].path);
    }),
  ];

  disposables.forEach((disposable) => {
    context.subscriptions.push(disposable);
  });
}

export function deactivate() {}
