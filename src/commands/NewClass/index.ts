import * as vscode from "vscode";

//import { ModelTemplate } from './templates';

export default class NewClass {
  private inputValue: string;
  // private className: string;
  // private namespaces: string[];
  private currentWorkspacePath: string;
  private path: string;
  private classType: string;
  // private classPath: string[];
  // private configuration: any;
  // private template: string | null;

  constructor() {
    this.inputValue = "";
    // this.className = '';
    this.currentWorkspacePath = "";
    this.path = "";
    this.classType = "";
    // this.configuration = [];
    // this.template = null;

    console.log("test");
  }

  process() {
    console.log("tesdt");
    this.currentWorkspacePath = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0].uri.path
      : "";

    let input: vscode.InputBox = vscode.window.createInputBox();

    console.log("COUCOu");

    input.onDidAccept(() => {
      this.inputValue = input.value;
      this.createClass();
      input.hide();
    });
    input.show();
  }

  // PRIVATE

  private createClass() {
    //    this.parseInput();
    console.log("bla");

    console.log(this.classType, this.path);

    switch (this.classType) {
      case "model":
        this.createModel();
    }
  }

  private parseInput() {
    console.log("a");
    const [classType, path] = this.inputValue.split(" ");

    this.classType = classType;
    this.path = path;
  }

  private createModel() {
    //    new ModelTemplate(this.path).bla();
  }
}

//   private applyConfig() {
//     const namespaceConfig = this.configuration.namespaces[this.namespaces[0]];
//     const config = namespaceConfig || this.configuration.namespaces['else'];

//     if (config === undefined) {
//       return ;
//     }

//     for (const key in config) {
//       const value = config[key];

//       switch (key) {
//         case 'rootDirectory':
//           this.classPath = [value].concat(this.classPath);
//           break;
//         case 'replaceWith':
//           if (namespaceConfig === undefined) {
//             this.classPath = [value].concat(this.classPath);
//             this.namespaces = [value].concat(this.namespaces);
//           } else {
//             this.namespaces[0] = value;
//           }
//         default:
//           break;
//       }
//     }
//   }

//   private parseInput() {
//     this.detectTemplate();

//     // if there is no /, this means there is only namespaces
//     if (this.inputValue.lastIndexOf('/') === -1) {
//       this.namespaces = this.inputValue.split('::');
//       this.className = this.namespaces.pop() || '';
//       this.classPath = this.namespaces;
//     } else {
//       // if there is a path before the namespaces, we have to take this path as the class path
//       // else, we have to take the namespaces before, then add the path
//       if (this.hasNamespaceBefore()) {
//         const pathPart = this.inputValue.substring(this.inputValue.lastIndexOf('/') + 1).split('/');
//         const namespacePart = this.inputValue.substring(0, this.inputValue.lastIndexOf('/')).split('::');

//         this.classPath = namespacePart.concat(pathPart);
//         this.namespaces = namespacePart.slice(0, namespacePart.length - 1);
//         this.className = this.classPath.pop() || '';

//       } else {
//         const pathPart = this.inputValue.substring(0, this.inputValue.lastIndexOf('/')).split('/');
//         const namespacePart = this.inputValue.substring(this.inputValue.lastIndexOf('/') + 1).split('::');

//         this.classPath = pathPart;
//         this.namespaces = namespacePart;
//         this.className = this.namespaces.pop() || '';
//       }
//     }
//   }

//   private detectTemplate() {
//     const parts = this.inputValue.split(" ");

//     if (parts.length === 1) {
//       return ;
//     }

//     this.template = parts[0];
//     this.inputValue = parts[1];
//   }

//   private camelizeNamespaces() {
//     let camelizedNamespaces: string[] = [];

//     for (const namespace of this.namespaces) {
//       camelizedNamespaces.push(namespace.split('-').reduce((res, word, idx) => {
//         // const text = (idx === 1) ? `${res.charAt(0).toUpperCase()}${res.substring(1).toLowerCase()}` : res;
//         const text = res;

//         return `${text}${word.charAt(0).toUpperCase()}${word.substring(1).toLowerCase()}`;
//       }));
//     }

//     this.namespaces = camelizedNamespaces;
//   }

//   private filePath(file: string) {
//     return this.currentWorkspacePath + '/' + file;
//   }
// /*
//   private createFiles() {
//     const templateBuilder = new TemplateBuilder(this.configuration);

//     const attributes = {
//       template: this.template,
//       namespaces: this.namespaces,
//       classDirectory: this.filePath(`${this.classPath.join('/')}/${this.className}`),
//       className: this.className,
//       includeGuard: this.generateIncludeGuard(),
//     };

//     templateBuilder.generateCppClass(attributes);
//   }
// */
//   private generateIncludeGuard() {
//     return `${vscode.workspace.name}/${vscode.workspace.asRelativePath(this.classPath.join('/'))}/${this.className}/hpp/`.toUpperCase().replace(/\//g, '_').replace(/\./g, '_').replace(/-/g, '_');
//   }

//   private hasNamespaceBefore() {
//     const hasPath = this.inputValue.indexOf('/') !== -1;
//     const hasNamespace = this.inputValue.indexOf('::') !== -1;

//     if (hasPath && !hasNamespace) {
//       return false;
//     } else if (!hasPath && hasNamespace) {
//       return true;
//     } else {
//       return this.inputValue.indexOf("::") < this.inputValue.indexOf("/");
//     }
//   }
// }
