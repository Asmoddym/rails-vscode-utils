import BaseGenerator from "./BaseGenerator";

export class Model extends BaseGenerator {
  protected onCreate() {
    this.setPathPrefix("app/models");
  }

  protected getFileContent(): string[] {
    return [
      `class ${this.attributes.className} < ApplicationRecord`,
      "  has_paper_trail",
      "  acts_as_tenant :organization, optional: false",
      "",
      "  no_sensible_attributes",
      "end",
    ];
  }
}
