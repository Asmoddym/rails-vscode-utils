import BaseGenerator from "./BaseGenerator";

export class Service extends BaseGenerator {
  protected onCreate() {
    this.setPathPrefix("app/services");

    if (!this.attributes.fileName.includes("_service")) {
      this.setFileSuffix("_service");
    }
  }

  protected getFileContent(): string[] {
    const hasArgs = this.attributes.args.length > 0;

    const content = [
      `class ${this.attributes.className} < ApplicationService`,
      hasArgs
        ? `  attr_reader ${this.attributes.args
            .map((arg) => `:${arg}`)
            .join(", ")}\n`
        : null,
      ...[hasArgs ? this.generateCustomInitialize() : [null]],
      "  def perform",
      "  end",
      "end",
    ];

    return content.filter((line) => line !== null) as NonNullable<string>[];
  }

  private generateCustomInitialize(): string[] {
    return [
      `def initialize(${this.attributes.args.join(", ")})`,
      ...this.attributes.args.map((arg) => `    @${arg} = ${arg}`),
      "",
      "    super",
      "  end",
      "",
    ];
  }
}
