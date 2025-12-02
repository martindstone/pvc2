// ExampleParent.tsx
import React, { useMemo, useState } from "react";
import { Stack } from "@chakra-ui/react";
import { ExpressionEditor, type ExpressionEditorValue } from "./ExpressionEditor";
import { evalExpression } from "../lib/expression";

export const ExpressionTester: React.FC = () => {
  const [expr, setExpr] = useState<ExpressionEditorValue>({
    name: "Profit formula",
    description: "Example expression",
    expression: {
      version: 1,
      source: "",
    },
  });

  const scope = { revenue: 1000, cost: 400, taxRate: 0.3, something: 0.5 };

  const result = useMemo(() => {
    try {
      if (!expr.expression.source.trim()) return null;
      return evalExpression(expr.expression, scope);
    } catch {
      return null;
    }
  }, [expr.expression, scope]);

  return (
    <Stack gap={4}>
      <ExpressionEditor
        value={expr}
        onChange={setExpr}
        result={result}
        scope={scope}
        debug
      />
    </Stack>
  );
};

export default ExpressionTester;
