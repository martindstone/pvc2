import React, { useMemo, useState } from "react";
import {
  Box,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

import { ExpressionEditor, type ExpressionEditorValue } from "./ExpressionEditor";
import { evalExpression } from "../lib/expression";
import { savedCalcsExpressions } from "./savedCalcs2";
import { program as savedProgram } from "./savedCalcs";

const toInitialInputs = () => {
  const initial: Record<string, number> = {};
  for (const inp of savedProgram.inputs) {
    const value = inp.default as number | boolean;
    initial[inp.name] = typeof value === "boolean" ? Number(value) : Number(value ?? 0);
  }
  return initial;
};

const toInitialSteps = (): ExpressionEditorValue[] =>
  savedCalcsExpressions.map((step) => ({
    name: step.name,
    description: step.description,
    expression: step.expression,
  }));

type StepExecution = {
  scope: Record<string, number>;
  value: number | null;
  error: string | null;
};

export const ExpressionTester: React.FC = () => {
  const [inputs, _setInputs] = useState<Record<string, number>>(toInitialInputs);
  const [steps, setSteps] = useState<ExpressionEditorValue[]>(toInitialSteps);

  const stepExecutions = useMemo(() => {
    const executions: StepExecution[] = [];
    let scope: Record<string, number> = { ...inputs };

    for (const step of steps) {
      const scopeForStep = { ...scope };
      let value: number | null = null;
      let error: string | null = null;

      try {
        if (step.expression.source.trim()) {
          value = evalExpression(step.expression, scopeForStep);
          scope = { ...scope, [step.name]: value };
        }
      } catch (err: any) {
        error = err?.message ?? "Unable to evaluate expression";
      }

      executions.push({ scope: scopeForStep, value, error });
    }

    return executions;
  }, [inputs, steps]);

  const handleStepChange = (index: number, next: ExpressionEditorValue) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? next : s)));
  };

  return (
    <Stack gap={8}>
      <Stack gap={6}>
        <Heading size="md">Stepwise expressions</Heading>
        {steps.map((step, index) => {
          const execution = stepExecutions[index];
          return (
            <Box
              key={index}
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
              p={4}
            >
              <Stack gap={4}>
                <ExpressionEditor
                  value={step}
                  onChange={(next) => handleStepChange(index, next)}
                  result={execution?.value ?? null}
                  scope={execution?.scope ?? {}}
                  debug
                />
                {execution?.error ? (
                  <Text color="red.500" fontSize="sm">
                    {execution.error}
                  </Text>
                ) : null}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default ExpressionTester;
