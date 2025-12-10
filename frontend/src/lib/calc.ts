import type { StoredExpression } from "./expression";

export type ProgramInput = {
  name: string;
  description: string;
  type: "integer" | "float" | "boolean";
  group?: string;
  units?: string;
  step?: number;
  default: number | boolean;
};

export type ProgramStep = {
  name: string;
  description: string;
  expression: StoredExpression;
};

export type ProgramOutput = {
  name: string;
  description: string;
  group?: string;
  type: "integer" | "float" | "boolean";
  units?: string;
  value: string | string[]; // expression name or expression tree
};

export type Program = {
  inputs: ProgramInput[];
  steps: ProgramStep[];
  outputs: ProgramOutput[];
};
