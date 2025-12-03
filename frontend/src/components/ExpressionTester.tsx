// ExampleParent.tsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Code,
  Field,
  Heading,
  NumberInput,
  SimpleGrid,
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

const ScopePreview: React.FC<{ scope: Record<string, number> }> = ({ scope }) => {
  const entries = Object.entries(scope);
  if (entries.length === 0) return null;
  return (
    <Box bg="gray.50" border="1px" borderColor="gray.200" borderRadius="md" p={3}>
      <Text fontWeight="medium" mb={1}>
        Available scope
      </Text>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={2} fontSize="sm">
        {entries.map(([key, value]) => (
          <Box key={key}>
            <Code colorScheme="purple">{key}</Code>
            <Text as="span" ml={2}>
              = {value}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export const ExpressionTester: React.FC = () => {
  const [inputs, setInputs] = useState<Record<string, number>>(toInitialInputs);
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

  const handleInputChange = (name: string, value: string) => {
    const numeric = Number(value);
    setInputs((prev) => ({ ...prev, [name]: Number.isNaN(numeric) ? 0 : numeric }));
  };

  const handleStepChange = (index: number, next: ExpressionEditorValue) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? next : s)));
  };

  return (
    <Stack gap={8}>
      <Box>
        <Heading size="md" mb={3}>
          Input scope
        </Heading>
        <Text color="gray.600" mb={4}>
          These values seed the initial scope. Each step can only reference these inputs and
          variables created by earlier steps.
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {savedProgram.inputs.map((input) => (
            <Field.Root key={input.name} gap={2}>
              <Field.Label fontSize="sm" color="fg.muted">
                <Text as="span" fontWeight="medium" color="fg.default">
                  {input.name}
                </Text>
                <Text as="span" color="fg.muted" ml={2}>
                  ({input.description})
                </Text>
              </Field.Label>
              <NumberInput.Root
                value={`${inputs[input.name] ?? ""}`}
                step={input.step ?? 0.1}
                onValueChange={(e) => handleInputChange(input.name, `${e.value}`)}
              >
                <NumberInput.Input />
                <NumberInput.Control />
              </NumberInput.Root>
            </Field.Root>
          ))}
        </SimpleGrid>
      </Box>

      <Box borderTopWidth="1px" borderColor="gray.200" />

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
                <ScopePreview scope={execution?.scope ?? {}} />
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
