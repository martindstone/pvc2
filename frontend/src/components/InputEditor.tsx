import React, { useState } from "react";
import {
  Field,
  HStack,
  IconButton,
  Input,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { PiCheckBold, PiPencilSimpleLine } from "react-icons/pi";

import type { Program, ProgramInput } from "../lib/calc";

type InputEditorProps = {
  program: Program;
  setProgram: (next: Program) => void;
  index: number;
};

const FieldContainer: React.FC<{
  label: string;
  flex?: number;
  children: React.ReactNode;
}> = ({ label, flex, children }) => (
  <Field.Root
    asChild
    style={{
      flex,
      minWidth: flex ? 0 : undefined,
      width: flex ? undefined : "100%",
    }}
  >
    <Stack
      gap={1}
      p={2}
      borderRadius="md"
      borderWidth="1px"
      borderColor="border.subtle"
      bg="bg.subtle"
      height="100%"
    >
      <Text
        fontSize="xs"
        color="fg.muted"
        textTransform="uppercase"
        letterSpacing="wider"
      >
        {label}
      </Text>
      {children}
    </Stack>
  </Field.Root>
);

const ReadonlyText: React.FC<{ value?: string }> = ({ value }) => (
  <Text
    fontWeight={value ? "semibold" : "normal"}
    color={value ? "inherit" : "fg.muted"}
    whiteSpace="normal"
    wordBreak="break-word"
    fontStyle={value ? "normal" : "italic"}
  >
    {value || "Not set"}
  </Text>
);

export const InputEditor: React.FC<InputEditorProps> = ({
  program,
  setProgram,
  index,
}) => {
  const input = program.inputs[index];
  const [isEditing, setIsEditing] = useState(() => {
    return !input?.name?.trim();
  });

  if (!input) return null;

  const updateInput = (next: Partial<ProgramInput>) => {
    const updatedInputs = program.inputs.map((inp, i) =>
      i === index ? { ...inp, ...next } : inp
    );
    setProgram({ ...program, inputs: updatedInputs });
  };

  const handleTypeChange = (nextType: ProgramInput["type"]) => {
    const nextDefault =
      nextType === "boolean"
        ? Boolean(input.default)
        : typeof input.default === "number"
          ? input.default
          : 0;

    updateInput({ type: nextType, default: nextDefault });
  };

  const editButtonLabel = isEditing ? "Finish editing input" : "Edit input";
  const booleanDefault =
    input.type === "boolean" ? input.default === true : Boolean(input.default);

  return (
    <Stack gap={3} w="full">
      <HStack gap={3} w="full" align="stretch">
        <FieldContainer label="Name" flex={1}>
          {isEditing ? (
            <Input
              value={input.name}
              onChange={(event) => updateInput({ name: event.target.value })}
              placeholder="Name"
              size="sm"
            />
          ) : (
            <ReadonlyText value={input.name?.trim() || "Untitled input"} />
          )}
        </FieldContainer>

        <FieldContainer label="Description" flex={2}>
          {isEditing ? (
            <Textarea
              value={input.description}
              onChange={(event) => updateInput({ description: event.target.value })}
              placeholder="Description"
              size="sm"
              resize="none"
              rows={1}
            />
          ) : (
            <ReadonlyText value={input.description?.trim()} />
          )}
        </FieldContainer>

        <Stack gap={2} align="flex-end" minW="fit-content" pt={1}>
          <IconButton
            aria-label={editButtonLabel}
            size="sm"
            variant={isEditing ? "solid" : "outline"}
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? <PiCheckBold /> : <PiPencilSimpleLine />}
          </IconButton>
        </Stack>
      </HStack>

      <HStack gap={3} align="stretch" flexWrap="wrap">
        <FieldContainer label="Type">
          {isEditing ? (
            <Select
              value={input.type}
              onChange={(event) => handleTypeChange(event.target.value as ProgramInput["type"])}
              size="sm"
            >
              <option value="integer">Integer</option>
              <option value="float">Float</option>
              <option value="boolean">Boolean</option>
            </Select>
          ) : (
            <ReadonlyText value={input.type} />
          )}
        </FieldContainer>

        <FieldContainer label="Group">
          {isEditing ? (
            <Input
              value={input.group ?? ""}
              onChange={(event) => updateInput({ group: event.target.value })}
              placeholder="Group"
              size="sm"
            />
          ) : (
            <ReadonlyText value={input.group?.trim()} />
          )}
        </FieldContainer>

        <FieldContainer label="Units">
          {isEditing ? (
            <Input
              value={input.units ?? ""}
              onChange={(event) => updateInput({ units: event.target.value })}
              placeholder="Units"
              size="sm"
            />
          ) : (
            <ReadonlyText value={input.units?.trim()} />
          )}
        </FieldContainer>
      </HStack>

      <HStack gap={3} align="stretch" flexWrap="wrap">
        <FieldContainer label="Default">
          {input.type === "boolean" ? (
            <Switch
              isChecked={booleanDefault}
              onChange={(event) => updateInput({ default: event.target.checked })}
            >
              {booleanDefault ? "True" : "False"}
            </Switch>
          ) : (
            <NumberInput.Root
              value={`${input.default ?? 0}`}
              onValueChange={(event) => {
                const value = event.valueAsNumber;
                if (Number.isNaN(value)) return;
                const nextValue = input.type === "integer" ? Math.round(value) : value;
                updateInput({ default: nextValue });
              }}
              step={input.step ?? (input.type === "integer" ? 1 : 0.1)}
            >
              <NumberInput.Input />
              {(input.type === "integer" || input.step !== undefined) && (
                <NumberInput.Control />
              )}
            </NumberInput.Root>
          )}
        </FieldContainer>

        {input.type !== "boolean" ? (
          <FieldContainer label="Step">
            {isEditing ? (
              <NumberInput.Root
                value={input.step ?? ""}
                onValueChange={(event) => {
                  const value = event.valueAsNumber;
                  if (Number.isNaN(value)) {
                    updateInput({ step: undefined });
                  } else {
                    updateInput({ step: value });
                  }
                }}
                step={0.1}
              >
                <NumberInput.Input placeholder="Optional step" />
                <NumberInput.Control />
              </NumberInput.Root>
            ) : (
              <ReadonlyText
                value={
                  input.step !== undefined && input.step !== null
                    ? String(input.step)
                    : undefined
                }
              />
            )}
          </FieldContainer>
        ) : null}
      </HStack>
    </Stack>
  );
};

export default InputEditor;
