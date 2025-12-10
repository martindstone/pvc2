import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Field,
  HStack,
  IconButton,
  Input,
  Menu,
  NumberInput,
  Portal,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { PiCaretDown, PiCheckBold, PiPencilSimpleLine } from "react-icons/pi";

import type { ProgramInput } from "../lib/calc";

const typeOptions: { value: ProgramInput["type"]; label: string }[] = [
  { value: "float", label: "Float" },
  { value: "integer", label: "Integer" },
  { value: "boolean", label: "Boolean" },
];

const FieldContainer: React.FC<{
  label: string;
  flex?: number;
  children: React.ReactNode;
}> = ({ label, flex, children }) => (
  <Field.Root
    asChild
    style={{
      flex,
      width: flex ? undefined : "100%",
      minWidth: flex ? 0 : undefined,
    }}
  >
    <Stack
      gap={0.5}
      px={2}
      py={1.5}
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

const AutoResizeTextarea: React.FC<
  Omit<React.ComponentProps<typeof Textarea>, "onChange"> & {
    onChange: (value: string) => void;
  }
> = ({ value, onChange, ...rest }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = event.currentTarget;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
    onChange(el.value);
  };

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      rows={1}
      resize="none"
      overflow="hidden"
      size="sm"
      minH="2.25rem"
      {...rest}
    />
  );
};

const numericValue = (value: ProgramInput["default"], fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const booleanValue = (value: ProgramInput["default"], fallback = false) =>
  typeof value === "boolean" ? value : fallback;

export type InputEditorProps = {
  value: ProgramInput;
  onChange: (next: ProgramInput) => void;
};

const InputEditor: React.FC<InputEditorProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(() => !value.name?.trim());

  const emitChange = (next: Partial<ProgramInput>) => {
    onChange({ ...value, ...next });
  };

  const handleTypeChange = (nextType: ProgramInput["type"]) => {
    if (nextType === value.type) return;

    if (nextType === "boolean") {
      emitChange({
        type: nextType,
        default: booleanValue(value.default),
        step: undefined,
      });
      return;
    }

    const nextDefault = numericValue(value.default);
    emitChange({
      type: nextType,
      default: nextType === "integer" ? Math.round(nextDefault) : nextDefault,
    });
  };

  const handleDefaultNumberChange = (nextValue: number) => {
    if (Number.isNaN(nextValue)) return;
    emitChange({
      default: value.type === "integer" ? Math.round(nextValue) : nextValue,
    });
  };

  const handleStepChange = (nextValue: number) => {
    if (Number.isNaN(nextValue)) {
      emitChange({ step: undefined });
      return;
    }
    emitChange({ step: nextValue });
  };

  const numericDefault = numericValue(value.default);
  const booleanDefault = booleanValue(value.default);
  const currentTypeLabel =
    typeOptions.find((option) => option.value === value.type)?.label ??
    value.type;
  const displayGroup = value.group?.trim() || "Not set";
  const displayUnits = value.units?.trim() || "Not set";
  const displayDefault =
    value.type === "boolean"
      ? booleanDefault
        ? "True"
        : "False"
      : numericDefault;

  const editButtonLabel = isEditing ? "Finish editing input" : "Edit input";

  return (
    <Stack gap={3} w="full" fontSize="xs" lineHeight="shorter">
      <HStack gap={2} align="stretch">
        <FieldContainer label="Name" flex={1}>
          {isEditing ? (
            <Input
              size="sm"
              value={value.name ?? ""}
              onChange={(event) => emitChange({ name: event.target.value })}
              placeholder="Unique identifier"
            />
          ) : (
            <Text fontWeight="semibold" wordBreak="break-word">
              {value.name?.trim() || "Untitled input"}
            </Text>
          )}
        </FieldContainer>

        <FieldContainer label="Description" flex={2}>
          {isEditing ? (
            <AutoResizeTextarea
              value={value.description ?? ""}
              onChange={(nextValue) =>
                emitChange({ description: nextValue })
              }
              placeholder="What does this input represent?"
            />
          ) : (
            <Text
              fontStyle="italic"
              color={value.description?.trim() ? "fg.muted" : "fg.subtle"}
              wordBreak="break-word"
            >
              {value.description?.trim() || "No description"}
            </Text>
          )}
        </FieldContainer>

        <Stack gap={1.5} align="flex-end" minW="fit-content" pt={1}>
          <IconButton
            aria-label={editButtonLabel}
            size="sm"
            variant="solid"
            colorPalette="gray"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? <PiCheckBold /> : <PiPencilSimpleLine />}
          </IconButton>
        </Stack>
      </HStack>

      {isEditing ? (
        <Stack gap={2}>
          <Stack
            direction={{ base: "column", md: "row" }}
            gap={2}
            align="stretch"
          >
            <FieldContainer label="Type" flex={1}>
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    display="inline-flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                    w="full"
                  >
                    {currentTypeLabel}
                    <PiCaretDown />
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content minW="200px">
                      {typeOptions.map((option) => (
                        <Menu.Item
                          key={option.value}
                          value={option.value}
                          onSelect={() => handleTypeChange(option.value)}
                        >
                          <HStack justify="space-between" w="full">
                            <Text>{option.label}</Text>
                            {value.type === option.value ? (
                              <PiCheckBold fontSize="0.8rem" />
                            ) : null}
                          </HStack>
                        </Menu.Item>
                      ))}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </FieldContainer>

            <FieldContainer label="Default" flex={1}>
              {value.type === "boolean" ? (
                <Checkbox.Root
                  checked={booleanDefault}
                  onCheckedChange={(event) =>
                    emitChange({ default: Boolean(event.checked) })
                  }
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label ml={2}>Enabled by default</Checkbox.Label>
                </Checkbox.Root>
              ) : (
                <NumberInput.Root
                  size="sm"
                  value={`${numericDefault}`}
                  onValueChange={(event) =>
                    handleDefaultNumberChange(event.valueAsNumber)
                  }
                  step={value.step ?? (value.type === "integer" ? 1 : 0.01)}
                  w="full"
                >
                  <NumberInput.Input />
                </NumberInput.Root>
              )}
            </FieldContainer>
          </Stack>

          <Stack
            direction={{ base: "column", md: "row" }}
            gap={3}
            align="stretch"
            flexWrap="wrap"
          >
            <FieldContainer label="Group" flex={1}>
              <Input
                size="sm"
                value={value.group ?? ""}
                onChange={(event) =>
                  emitChange({ group: event.target.value || undefined })
                }
                placeholder="e.g. Demand"
              />
            </FieldContainer>

            <FieldContainer label="Units" flex={1}>
              <Input
                size="sm"
                value={value.units ?? ""}
                onChange={(event) =>
                  emitChange({ units: event.target.value || undefined })
                }
                placeholder="percent, currency, etc."
              />
            </FieldContainer>

            {value.type !== "boolean" ? (
              <FieldContainer label="Step" flex={1}>
                <NumberInput.Root
                  size="sm"
                  value={value.step === undefined ? "" : `${value.step}`}
                  onValueChange={(event) =>
                    handleStepChange(event.valueAsNumber)
                  }
                  step={value.type === "integer" ? 1 : value.step ?? 0.01}
                  w="full"
                >
                  <NumberInput.Input />
                </NumberInput.Root>
                <Text fontSize="xs" color="fg.muted">
                  Optional increment for editors
                </Text>
              </FieldContainer>
            ) : null}
          </Stack>
        </Stack>
      ) : (
        <Stack gap={1.5}>
          <Stack
            direction={{ base: "column", md: "row" }}
            gap={2}
            align="stretch"
          >
            <FieldContainer label="Type" flex={1}>
              <Text fontWeight="medium">{currentTypeLabel}</Text>
            </FieldContainer>

            <FieldContainer label="Default" flex={1}>
              <Text fontWeight="medium">{displayDefault}</Text>
            </FieldContainer>
          </Stack>

          <Stack
            direction={{ base: "column", md: "row" }}
            gap={2}
            align="stretch"
            flexWrap="wrap"
          >
            <FieldContainer label="Group" flex={1}>
              <Text color={displayGroup === "Not set" ? "fg.muted" : undefined}>
                {displayGroup}
              </Text>
            </FieldContainer>

            <FieldContainer label="Units" flex={1}>
              <Text color={displayUnits === "Not set" ? "fg.muted" : undefined}>
                {displayUnits}
              </Text>
            </FieldContainer>

            {value.type !== "boolean" ? (
              <FieldContainer label="Step" flex={1}>
                <Text color={value.step === undefined ? "fg.muted" : undefined}>
                  {value.step ?? "Not set"}
                </Text>
              </FieldContainer>
            ) : null}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default InputEditor;
