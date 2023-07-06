import * as vscode from "vscode";
import { TextEncoder } from "util";

export default class BaseGenerator {
  protected attributes: {
    path: string[];
    fileName: string;
    namespaces: string[];
  };

  private workspacePath: string;
  private fileSuffix: string;

  constructor(path: string) {
    let parts = path.split("::");

    const fileName =
      parts.length === 1 ? parts[0] : parts.splice(parts.length - 1, 1)[0];
    if (parts.length === 1) {
      parts = [];
    }

    this.attributes = {
      fileName: fileName,
      path: parts,
      namespaces: parts,
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

    return vscode.workspace.fs.writeFile(
      this.buildFileUri(filePath),
      new TextEncoder().encode(this.buildFileContent()),
    );
  }

  private buildFileContent(): string {
    let text = "";

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

    this.attributes.namespaces.forEach((namespace: string, i: number) => {
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

// import * as vscode from 'vscode';
// import { TextEncoder } from 'util';
// import VariableInterpolator from './VariableInterpolator';
// import { CppHeader } from '../utl/CppHeader';

// const cppClassTemplate = (content: (configuration: any) => string, configuration: any) => `[[cppInclude]]

// ${content(configuration)}`;

// const defaultCppClassContentTemplate = (configuration: any) => `${configuration.general?.constructorAndDestructorInCppFile ? "[[cppConstructor]]\n\n[[cppDestructor]]\n\n\n" : ""}[[cppPublic]]

// [[cppPrivate]]

// `;

// const hppClassTemplate = (content: (configuration: any) => string, configuration: any) => `[[hppGuardBegin]]

// ${content(configuration)}

// [[hppGuardEnd]]
// `;

// const defaultHppClassContentTemplate = (configuration: any) => `[[hppNamespacesBegin]]
// [[hppClassSpacing]][[hppClassDefinitionBegin]]
// [[hppClassSpacing]][[hppPrivate]]

// [[hppClassSpacing]][[hppPublic]]
// [[hppPrototypeSpacing]][[hppConstructor${configuration.general?.constructorAndDestructorInCppFile ? "" : "Default"}]]
// [[hppPrototypeSpacing]][[hppDestructor${configuration.general?.constructorAndDestructorInCppFile ? "" : "Default"}]]

// [[hppPrototypeSpacing]][[hppGetters]]

// [[hppPrototypeSpacing]][[hppSetters]]

// [[hppClassSpacing]][[hppPrivate]]

// [[hppClassSpacing]][[hppProtected]]

// [[hppClassSpacing]][[hppClassDefinitionEnd]]
// [[hppNamespacesEnd]]
// `;

// const hppFileTemplate = (configuration: any) => `[[hppGuardBegin]]\n\n\n\n[[hppGuardEnd]]`;

// export default class TemplateBuilder {
//   private configuration: any;

//   constructor(configuration: any) {
//     this.configuration = configuration;
//   }

//   // Class generation

//   public generateCppClass(attributes: any) {
//     const { classDirectory, className } = attributes;

//     this.createDirectory(classDirectory).then(() => {
//       const cppUri = this.buildFileUri(`${classDirectory}/${className}.cpp`);
//       const hppUri = this.buildFileUri(`${classDirectory}/${className}.hpp`);

//       this.generateFile(hppUri, this.generateHppContentForClass(attributes))
//         .then(() => this.openFile(hppUri));

//         this.generateFile(cppUri, this.generateCppContentForClass(attributes))
//         .then(() => this.openFile(cppUri));
//     });
//   }

//   private generateCppContentForClass(attributes: any) {
//     const templateContent = this.getClassTemplateContent(attributes, 'cpp', defaultCppClassContentTemplate);
//     const rawText = cppClassTemplate(templateContent, this.configuration);

//     return new VariableInterpolator().process(rawText, attributes);
//   }

//   private generateHppContentForClass(attributes: any) {
//     const templateContent = this.getClassTemplateContent(attributes, 'hpp', defaultHppClassContentTemplate);
//     const rawText = hppClassTemplate(templateContent, this.configuration);

//     return new VariableInterpolator().process(rawText, attributes);
//   }

//   private getClassTemplateContent(attributes: any, type: string, fallback: (attributes: any) => string) {
//     const customTemplate = this.getCustomContentTemplate(attributes);

//     if (!!customTemplate) {
//       return (configuration: any) => customTemplate[type].join("\n");
//     }

//     return fallback;
//   }

//   private getCustomContentTemplate(attributes: any) {
//     const { template } = attributes;

//     if (!this.configuration.templates) {
//       return undefined;
//     }

//     return this.configuration.templates[template];
//   }

//   // File generation

//   public generateHppFile(attributes: any) {
//     const { directory, attributes.fileName } = attributes;

//     this.createDirectory(directory).then(() => {
//       const uri = this.buildFileUri(`${directory}/${attributes.fileName}${attributes.fileName.includes(".hpp") ? "" : ".hpp"}`);

//       this.generateFile(uri, this.generateHppContentForFile(attributes))
//         .then(() => this.openFile(uri));
//     });
//   }

//   private generateHppContentForFile(attributes: any) {
//     return new VariableInterpolator().process(hppFileTemplate(this.configuration), attributes);
//   }

//   // Utils

//   private createDirectory(directory: string) {
//     return vscode.workspace.fs.createDirectory(this.buildFileUri(directory));
//   }

//   private generateFile(uri: vscode.Uri, content: string) {
//     let fileContent = this.configuration.general?.addHeader ? new CppHeader().generateHeaderForFile(uri) : "";

//     fileContent += content;

//     return vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(fileContent));
//   }

//   private buildFileUri(path: string) {
//     return vscode.Uri.file(path);
//   }

//   private openFile(uri: vscode.Uri) {
//     vscode.commands.executeCommand('vscode.open', uri);
//   }
// }
