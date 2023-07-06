import BaseGenerator from "./BaseGenerator";

export class Class extends BaseGenerator {
  protected getFileContent(): string[] {
    return [`class ${this.attributes.fileName}`, "end"];
  }
}
