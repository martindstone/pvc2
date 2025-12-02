import { ComputeEngine } from "@cortex-js/compute-engine";
import type { BoxedExpression } from "@cortex-js/compute-engine";
// Inlined program interfaces (moved from savedCalcs.ts)
export interface ProgramInput {
  name: string;
  description: string;
  type: 'integer' | 'float' | 'boolean';
  step?: number;
  group?: string;
  units?:
    | 'incidents'
    | 'hours'
    | 'minutes'
    | 'people'
    | 'currency'
    | 'percent'
    | 'years'
    | 'count';
  default: number | boolean;
}

export type ProgramStepExpression = string | number | any[];

export interface ProgramStep {
  let: string;
  expr: ProgramStepExpression;
}

export interface ProgramOutput {
  name: string;
  description: string;
  type: 'integer' | 'float';
  units?: 'currency' | 'percent' | 'months' | 'count';
  group?: string;
  // DSL expression or variable name
  value: unknown;
}

export interface Program {
  inputs: ProgramInput[];
  steps: ProgramStep[];
  outputs: ProgramOutput[];
}

type MathJson = any;

export type CalcProgram = Program;

// Detailed validation types
export type CalcValidationError =
  | { code: 'NO_STEPS_ARRAY'; message: string }
  | { code: 'INVALID_INPUT'; message: string; index?: number }
  | { code: 'STEP_EXPR_UNDEFINED'; message: string; stepIndex: number }
  | { code: 'NO_OUTPUTS'; message: string };

export type CalcValidationResult =
  | { ok: true }
  | { ok: false; error: CalcValidationError };

export const calcValidate = (program: CalcProgram): CalcValidationResult => {
  if (!program?.steps || !Array.isArray(program.steps) || program.steps.length === 0) {
    return { ok: false, error: { code: 'NO_STEPS_ARRAY', message: 'program.steps must be a non-empty array' } };
  }

  if (!program?.inputs || !Array.isArray(program.inputs)) {
    return { ok: false, error: { code: 'INVALID_INPUT', message: 'program.inputs must be an array' } };
  }

  for (let i = 0; i < program.inputs.length; i++) {
    const input = program.inputs[i] as ProgramInput;
    if (!input || typeof input.name !== 'string') {
      return { ok: false, error: { code: 'INVALID_INPUT', message: `inputs[${i}] must have a name`, index: i } };
    }
    if (!('default' in input)) {
      return { ok: false, error: { code: 'INVALID_INPUT', message: `inputs[${i}] must include a default`, index: i } };
    }
  }

  if (!program?.outputs || !Array.isArray(program.outputs) || program.outputs.length === 0) {
    return { ok: false, error: { code: 'NO_OUTPUTS', message: 'program.outputs must be a non-empty array' } };
  }

  for (let si = 0; si < program.steps.length; si++) {
    const step = program.steps[si] as ProgramStep;
    if (!step || typeof step.let !== 'string' || typeof step.expr === 'undefined') {
      return { ok: false, error: { code: 'STEP_EXPR_UNDEFINED', message: `steps[${si}] must have a let and expr`, stepIndex: si } };
    }
  }

  const letNames = new Set<string>(program.steps.map(s => s.let));
  for (let oi = 0; oi < program.outputs.length; oi++) {
    const output = program.outputs[oi];
    if (!output || typeof output.name !== 'string' || typeof output.value === 'undefined') {
      return { ok: false, error: { code: 'INVALID_INPUT', message: `outputs[${oi}] must have a name and value` } };
    }
    if (typeof output.value === 'string' && !letNames.has(output.value as string)) {
      return { ok: false, error: { code: 'INVALID_INPUT', message: `outputs[${oi}].value references unknown variable '${output.value}'` } };
    }
  }

  return { ok: true };
};

export const calcRun = (
  program: CalcProgram,
): ProgramOutput[] => {
  const validation = calcValidate(program);
  if (!validation.ok) {
    throw new Error(`Calc program isn't valid: ${validation.error.message}`);
  }

  const ce = new ComputeEngine();

  // env: symbol -> BoxedExpression
  const env: Record<string, BoxedExpression> = {};

  // Populate env from program.inputs using each input.default
  for (const input of program.inputs) {
    env[input.name] = ce.box(input.default as any);
  }

  let last: BoxedExpression = ce.box(0);

  // Force numeric evaluation + unwrap to number
  const toNumber = (be: BoxedExpression): number => {
    // N(): numeric approximation; valueOf(): JS primitive number/string/etc.
    const v = be.N().valueOf(); // :contentReference[oaicite:5]{index=5} :contentReference[oaicite:6]{index=6}
    return typeof v === "number" ? v : NaN;
  };

  // Evaluate with env: substitute, evaluate, approximate
  const evalWithEnv = (e: string | MathJson): BoxedExpression => {
    const bx = typeof e === "string" && env[e] ? env[e] : ce.box(e);
    // Replace symbols (subs), then evaluate, then approximate if still exact
    // subs(): efficient symbol substitution :contentReference[oaicite:7]{index=7}
    return bx.subs(env).evaluate({ numericApproximation: true }); // :contentReference[oaicite:8]{index=8}
  };

  for (const step of program.steps) {
    // ProgramStep has `let` and `expr`
    last = evalWithEnv(step.expr as any);
    env[(step.let as string)] = last;
  }

  // Evaluate outputs (ProgramOutput[].value) and return an array of outputs
  const results: ProgramOutput[] = [];
  for (const o of program.outputs) {
    let numeric = NaN;
    try {
      numeric = toNumber(evalWithEnv(o.value as any));
    } catch (e) {
      numeric = NaN;
    }
    results.push({ ...o, value: numeric });
  }
  return results;
};