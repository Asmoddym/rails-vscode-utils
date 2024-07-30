import camelToSnakeCase from "../../../helpers/camelToSnakeCase";
import BaseGenerator from "./BaseGenerator";

export class Spec extends BaseGenerator {
  protected onCreate() {
    let prefix = "spec";

    if (this.attributes.fileName.includes("_service_spec.rb")) {
      prefix = "spec/unit/services";
    }

    if (this.attributes.fileName.includes("models")) {
      prefix = "spec/unit/models";
    }

    this.setPathPrefix(prefix);

    this.attributes.modules = this.attributes.modules.filter(item => item !== "models");

    console.log(this.attributes)
  }

  protected getFileHeaders(): string[] {
    return ["require \"unit_helper\""];
  }

  protected getFileContent(): string[] {
    let content: string[] = [];

    if (this.attributes.fileName.includes("_service_spec.rb")) {
      content = this.getServiceSpecContent();
    }

    if (this.attributes.fileName.includes("models")) {
      content = this.getModelSpecContent();
    }

    return content.filter((line) => line !== null) as NonNullable<string>[];
  }

  private getServiceSpecContent() {
    return [
      `describe ${this.attributes.className.split("Spec")[0]} do`,
      `  subject { described_class.new(params) }`,
      ``,
      `  describe "#perform" do`,
      `    context "when params are valid" do`,
      `      let(:params) { {} }`,
      ``,
      `      it { expect { subject.perform }.not_to raise_error }`,
      `    end`,
      `  end`,
      `end`
    ];
  }

  private getModelSpecContent() {
    return [
      `describe ${this.attributes.className.split("Spec")[0]} do`,
      `  describe "#validate" do`,
      `    subject { build(:${camelToSnakeCase(this.attributes.className)}) }`,
      ``,
      `    context "when params are valid" do`,
      `      it { expect(subject).to be_valid }`,
      `    end`,
      `  end`,
      `end`
    ];
  }
}
