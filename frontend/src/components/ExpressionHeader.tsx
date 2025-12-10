// components/ExpressionHeader.tsx
import React, { useEffect, useRef } from "react";
import {
  Field,
  HStack,
  IconButton,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { PiCheckBold, PiPencilSimpleLine } from "react-icons/pi";

import type { ExpressionEditorValue } from "./ExpressionEditor";
import ExpressionDebugPopover from "./ExpressionDebugPopover";

type ExpressionHeaderProps = {
  name: string;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (desc: string) => void;
  isEditing: boolean;
  onToggleEditing: () => void;
  editButtonLabel: string;
  debug: boolean;
  debugValue: ExpressionEditorValue;
  scope?: Record<string, number>;
  canExitEditing: boolean;
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

// Auto-resizing textarea that grows with content, no scrollbar/handle
type AutoResizeTextareaProps = {
  value: string;
  onChange: (value: string) => void;
} & Omit<React.ComponentProps<typeof Textarea>, "value" | "onChange">;

const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({
  value,
  onChange,
  ...rest
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Ensure height is correct when value changes from outside
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const el = event.currentTarget;
    // Resize to fit content
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
      // Keeps it visually similar to an Input when short
      minH="2.25rem"
      {...rest}
    />
  );
};

export const ExpressionHeader: React.FC<ExpressionHeaderProps> = ({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  isEditing,
  onToggleEditing,
  editButtonLabel,
  debug,
  debugValue,
  scope,
  canExitEditing,
}) => {
  const displayName = name?.trim() || "Untitled expression";
  const displayDescription = description?.trim();

  return (
    <HStack gap={3} w="full" align="stretch">
      <FieldContainer label="Name" flex={1}>
        {isEditing ? (
          <AutoResizeTextarea
            value={name ?? ""}
            onChange={onNameChange}
            placeholder="Name"
          />
        ) : (
          <Text
            fontWeight="semibold"
            whiteSpace="normal"
            wordBreak="break-word"
          >
            {displayName}
          </Text>
        )}
      </FieldContainer>

      <FieldContainer label="Description" flex={2}>
        {isEditing ? (
          <AutoResizeTextarea
            value={description ?? ""}
            onChange={onDescriptionChange}
            placeholder="Description"
          />
        ) : (
          <Text
            fontStyle="italic"
            color="fg.muted"
            whiteSpace="normal"
            wordBreak="break-word"
          >
            {displayDescription || "No description"}
          </Text>
        )}
      </FieldContainer>

      <Stack gap={2} align="flex-end" minW="fit-content" pt={1}>
        <IconButton
          aria-label={editButtonLabel}
          size="sm"
          variant={isEditing ? "solid" : "outline"}
          onClick={onToggleEditing}
          disabled={isEditing && !canExitEditing}
        >
          {isEditing ? <PiCheckBold /> : <PiPencilSimpleLine />}
        </IconButton>
        {debug ? (
          <ExpressionDebugPopover value={debugValue} scope={scope} />
        ) : null}
      </Stack>
    </HStack>
  );
};

export default ExpressionHeader;
