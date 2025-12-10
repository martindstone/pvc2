import React, { useMemo } from "react";
import { Box, Button, Stack, Text } from "@chakra-ui/react";

import { ExpressionEditor, type ExpressionEditorValue } from "./ExpressionEditor";
import type { Program as CalcProgram } from "../lib/calc";
import { evalExpression } from "../lib/expression";

type StepExecution = {
  scope: Record<string, number>;
  value: number | null;
  error: string | null;
};

type ProgramStepsEditorProps = {
  program: CalcProgram;
  setProgram: (next: CalcProgram) => void;
};

export const ProgramStepsEditor: React.FC<ProgramStepsEditorProps> = ({
  program,
  setProgram,
}) => {
  const stepExecutions = useMemo(() => {
    const executions: StepExecution[] = [];
    let scope: Record<string, number> = program.inputs.reduce((acc, inp) => {
      const value = inp.default as number | boolean;
      acc[inp.name] = typeof value === "boolean" ? Number(value) : Number(value ?? 0);
      return acc;
    }, {} as Record<string, number>);

    for (const step of program.steps) {
      const scopeForStep = { ...scope };
      let value: number | null = null;
      let error: string | null = null;

      try {
        if (step.expression.source.trim()) {
          value = evalExpression(step.expression, scopeForStep);
          scope = { ...scope, [step.name]: value };
        }
      } catch (err: unknown) {
        error = err instanceof Error ? err.message : "Unable to evaluate expression";
      }

      executions.push({ scope: scopeForStep, value, error });
    }

    return executions;
  }, [program.inputs, program.steps]);

  const handleStepChange = (index: number, next: ExpressionEditorValue) => {
    const newSteps = program.steps.map((step, i) => (i === index ? next : step));
    setProgram({ ...program, steps: newSteps });
  };

  const handleAddStep = () => {
    const newStep: ExpressionEditorValue = {
      name: `step${program.steps.length + 1}`,
      description: "",
      expression: {
        version: 1,
        source: "",
      },
    };
    setProgram({ ...program, steps: [...program.steps, newStep] });
  };

  return (
    <Stack gap={4} w="full" fontSize="xs" lineHeight="shorter">
      {program.steps.length === 0 ? (
        <Box border="1px" borderColor="border.subtle" borderRadius="md" p={3}>
          <Text color="fg.muted">No steps defined yet.</Text>
        </Box>
      ) : (
        program.steps.map((step, index) => {
          const execution = stepExecutions[index];
          return (
            <Box
              key={`${step.name}-${index}`}
              border="1px"
              borderColor="border.subtle"
              borderRadius="md"
              p={3}
              bg="green.200"
            >
              <Stack gap={3}>
                <Box fontSize="inherit" lineHeight="inherit">
                  <ExpressionEditor
                    value={step}
                    onChange={(next) => handleStepChange(index, next)}
                    result={execution?.value ?? null}
                    scope={execution?.scope ?? {}}
                    debug
                    density="compact"
                  />
                </Box>
                {execution?.error ? (
                  <Text color="red.500" fontSize="xs">
                    {execution.error}
                  </Text>
                ) : null}
              </Stack>
            </Box>
          );
        })
      )}

      <Button
        onClick={handleAddStep}
        variant="outline"
        size="sm"
        alignSelf="flex-start"
      >
        Add step
      </Button>
    </Stack>
  );
};

export default ProgramStepsEditor;
