import type { MathNode } from "mathjs";
import { create, all } from "mathjs";

const math = create(all, {
  number: "number",
  matrix: "Array",
});

// Extra symbols to allow (beyond mathjs builtins and __v_* variable names)
const ADDITIONAL_ALLOWED_SYMBOLS = new Set(["end"]);

// For checking mathjs builtins
const mathRecord = math as unknown as Record<string, unknown>;

export type StoredExpression = {
  version: 1;
  source: string;
};

export type ExpressionAnalysis = {
  variables: string[];
  error: string | null;
};

// Matches {{variableName}} where variableName is a valid identifier
const VAR_DECORATION_RE = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

// Extract variable names from an expression source string
export function extractVariables(source: string): string[] {
  const vars = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = VAR_DECORATION_RE.exec(source)) !== null) {
    vars.add(match[1]);
  }
  return Array.from(vars).sort();
}

// Convert expression source to internal form (replace {{var}} with __v_var)
function toInternalExpression(source: string): {
  internal: string;
  variables: string[];
} {
  const seen = new Set<string>();
  const variables: string[] = [];

  const internal = source.replace(VAR_DECORATION_RE, (_full, name: string) => {
    if (!seen.has(name)) {
      seen.add(name);
      variables.push(name);
    }
    return `__v_${name}`;
  });

  return { internal, variables };
}

// Check if a name is a mathjs builtin function/constant
const hasMathBuiltin = (name: string) => name in mathRecord;

// Check if a symbol name is allowed in expressions
const isAllowedSymbol = (name?: string): boolean => {
  if (!name) return false;
  if (name.startsWith("__v_")) return true;
  if (ADDITIONAL_ALLOWED_SYMBOLS.has(name)) return true;
  if (hasMathBuiltin(name)) return true;
  return false;
};

// Walk the AST and return the first symbol name that isn't allowed, or null.
function findUnknownSymbolName(root: MathNode): string | null {
  let badSymbol: string | null = null;

  root.traverse((node: MathNode) => {
    if (badSymbol) return;

    const s = node as any;
    if (s.isSymbolNode) {
      const name: string | undefined = s.name;
      if (!isAllowedSymbol(name)) {
        badSymbol = name ?? null;
      }
    }
  });

  return badSymbol;
}

// Walk the AST and see if there is any constant node whose value is a string.
// This indicates the user has included quoted text in the expression, which is not allowed.
function containsStringLiteral(root: MathNode): boolean {
  let found = false;

  root.traverse((node: MathNode) => {
    if (found) return;

    const c = node as any;
    if (c.isConstantNode && typeof c.value === "string") {
      found = true;
    }
  });

  return found;
}

// Analyze an expression source string for variables and errors
export function analyzeExpression(source: string): ExpressionAnalysis {
  const trimmed = source.trim();
  if (!trimmed) {
    return { variables: [], error: null };
  }

  const variables = extractVariables(source);
  const { internal } = toInternalExpression(source);

  try {
    const node: MathNode = math.parse(internal);

    const badName = findUnknownSymbolName(node);
    if (badName) {
      return {
        variables,
        error: `Unknown symbol "${badName}". Reference inputs as {{${badName}}}.`,
      };
    }

    if (containsStringLiteral(node)) {
      return {
        variables,
        error: "Expressions must resolve to numeric values, not quoted text.",
      };
    }

    return { variables, error: null };
  } catch (err: any) {
    return {
      variables,
      error: err?.message ?? "Invalid expression",
    };
  }
}

// Evaluate an expression with a given scope of variable values and return the numeric result
export function evalExpression(
  expr: StoredExpression,
  scope: Record<string, number>
): number {
  const source = expr.source?.trim() ?? "";
  if (!source) {
    throw new Error("No expression");
  }

  const { internal } = toInternalExpression(source);
  const node = math.parse(internal);

  const internalScope: Record<string, number> = {};
  for (const [name, value] of Object.entries(scope)) {
    internalScope[`__v_${name}`] = value;
  }

  const result = node.evaluate(internalScope);
  if (typeof result !== "number" || Number.isNaN(result)) {
    throw new Error("Expression did not resolve to a finite number");
  }
  return result;
}
