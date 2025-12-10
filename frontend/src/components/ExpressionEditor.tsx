// components/ExpressionEditor.tsx
import React, { useMemo, useState } from "react";
import { Stack } from "@chakra-ui/react";

import type { StoredExpression } from "../lib/expression";
import { analyzeExpression } from "../lib/expression";

import ExpressionHeader from "./ExpressionHeader";
import ExpressionExpressionField from "./ExpressionExpressionField";
import ExpressionValueDisplay from "./ExpressionValueDisplay";

export type ExpressionEditorValue = {
  expression: StoredExpression;
  name: string;
  description: string;
};

type ExpressionEditorProps = {
  value: ExpressionEditorValue;
  onChange: (next: ExpressionEditorValue) => void;
  placeholder?: string;
  result?: number | null;
  debug?: boolean;
  scope?: Record<string, number>;
};

const EXPRESSION_MIN_HEIGHT = "96px";

function useExpressionValidation(
  source: string,
  scope?: Record<string, number>
) {
  const availableVariables = useMemo(
    () => Object.keys(scope ?? {}),
    [scope]
  );

  return useMemo(() => {
    const { error, variables: usedVariables } = analyzeExpression(source ?? "");
    const availableSet = new Set(availableVariables);

    const missingNames = usedVariables
      .filter((name) => !availableSet.has(name))
      .sort();

    const hasMissingVariables = missingNames.length > 0;
    const fieldInvalid = Boolean(error) || hasMissingVariables;

    return {
      error,
      missingVariableNames: missingNames,
      hasMissingVariables,
      fieldInvalid,
      availableVariables,
    };
  }, [source, availableVariables]);
}

export const ExpressionEditor: React.FC<ExpressionEditorProps> = ({
  value,
  onChange,
  placeholder = "e.g. 2 * ({{revenue}} - {{cost}}) / {{cost}}",
  result,
  debug = false,
  scope,
}) => {
  // Start in editing mode if there's no expression yet
  const [isEditing, setIsEditing] = useState(() => {
    const src = value.expression?.source ?? "";
    return !src.trim();
  });

  const source = value.expression?.source ?? "";

  const {
    error,
    missingVariableNames,
    hasMissingVariables,
    fieldInvalid,
    availableVariables,
  } = useExpressionValidation(source, scope);

  const emitChange = (next: Partial<ExpressionEditorValue>) => {
    onChange({ ...value, ...next });
  };

  const updateSource = (nextSource: string) => {
    emitChange({
      expression: {
        version: value.expression?.version ?? 1,
        source: nextSource,
      },
    });
  };

  const editButtonLabel = isEditing
    ? "Finish editing expression"
    : "Edit expression";

  return (
    <Stack gap={1} w="full">
      <ExpressionHeader
        name={value.name}
        description={value.description}
        onNameChange={(name) => emitChange({ name })}
        onDescriptionChange={(description) => emitChange({ description })}
        isEditing={isEditing}
        onToggleEditing={() => setIsEditing((prev) => !prev)}
        editButtonLabel={editButtonLabel}
        debug={debug}
        debugValue={value}
        scope={scope}
        canExitEditing={!fieldInvalid}
      />

      <ExpressionExpressionField
        label="Expression"
        minHeight={EXPRESSION_MIN_HEIGHT}
        isEditing={isEditing}
        source={source}
        onSourceChange={updateSource}
        placeholder={placeholder}
        availableVariables={availableVariables}
        fieldInvalid={fieldInvalid}
        error={error}
        hasMissingVariables={hasMissingVariables}
        missingVariableNames={missingVariableNames}
      />

      <ExpressionValueDisplay
        label="Value"
        result={result}
        fieldInvalid={fieldInvalid}
      />
    </Stack>
  );
};

export default ExpressionEditor;
