import BaseGenerator from "./BaseGenerator";

export class Service extends BaseGenerator {
  protected onCreate() {
    this.setPathPrefix("app/services");
    this.setFileSuffix("_service");
  }
  protected getFileContent(): string[] {
    return [`class ${this.attributes.fileName} < ApplicationService`, "end"];
  }
}
