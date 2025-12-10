import React, { useEffect, useMemo, useRef } from "react";
import {
  Box,
  Button,
  Field,
  HStack,
  Menu,
  Portal,
  Stack,
  Tag,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { PiCaretDown } from "react-icons/pi";

const VAR_DECORATION_RE = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

type PreviewPart = { text: string; varName?: string };

type Props = {
  label: string;
  minHeight: string | number;
  isEditing: boolean;
  source: string;
  onSourceChange: (next: string) => void;
  placeholder: string;
  availableVariables: string[];
  fieldInvalid: boolean;
  error: string | null;
  hasMissingVariables: boolean;
  missingVariableNames: string[];
};

const FieldContainer: React.FC<{
  label: string;
  minH?: string | number;
  children: React.ReactNode;
}> = ({ label, minH, children }) => (
  <Box w="full">
    <Stack
      gap={1}
      p={3}
      borderRadius="md"
      borderWidth="1px"
      borderColor="border.subtle"
      bg="bg.subtle"
      minH={minH}
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
  </Box>
);

function getPreviewParts(source: string): {
  parts: PreviewPart[];
  hasContent: boolean;
} {
  const src = source ?? "";
  if (!src) return { parts: [], hasContent: false };

  const parts: PreviewPart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  VAR_DECORATION_RE.lastIndex = 0;

  while ((match = VAR_DECORATION_RE.exec(src)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: src.slice(lastIndex, match.index) });
    }
    parts.push({ text: match[0], varName: match[1] });
    lastIndex = VAR_DECORATION_RE.lastIndex;
  }

  if (lastIndex < src.length) {
    parts.push({ text: src.slice(lastIndex) });
  }

  return { parts, hasContent: true };
}

export const ExpressionExpressionField: React.FC<Props> = ({
  label,
  minHeight,
  isEditing,
  source,
  onSourceChange,
  placeholder,
  availableVariables,
  fieldInvalid,
  error,
  hasMissingVariables,
  missingVariableNames,
}) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Focus when entering edit mode
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  // Ensure height matches content whenever source changes while editing
  useEffect(() => {
    if (!isEditing) return;
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [isEditing, source]);

  const insertVar = (name: string) => {
    const el = inputRef.current;
    const token = `{{${name}}}`;

    if (!el) {
      onSourceChange(source + token);
      return;
    }

    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;

    const before = el.value.slice(0, start);
    const after = el.value.slice(end);

    const next = `${before}${token}${after}`;
    onSourceChange(next);

    queueMicrotask(() => {
      el.focus();
      const pos = start + token.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    // Auto-grow as user types
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
    onSourceChange(el.value);
  };

  const previewParts = useMemo(() => getPreviewParts(source), [source]);

  const missingVariablesSet = useMemo(
    () => new Set(missingVariableNames),
    [missingVariableNames]
  );

  return (
    <FieldContainer label={label} minH={minHeight}>
      {isEditing ? (
        <HStack gap={2} align="flex-start" flexWrap="nowrap">
          <Menu.Root positioning={{ placement: "bottom-start" }}>
            <Menu.Trigger asChild>
              <Button
                size="sm"
                variant="outline"
                display="inline-flex"
                gap={1}
                flexShrink={0}
              >
                Variables
                <PiCaretDown />
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content maxH="240px" overflowY="auto">
                  {availableVariables.length === 0 ? (
                    <Menu.Item value="__none" disabled>
                      No variables
                    </Menu.Item>
                  ) : (
                    availableVariables.map((name) => (
                      <Menu.Item
                        key={name}
                        value={name}
                        onSelect={() => insertVar(name)}
                      >
                        {name}
                      </Menu.Item>
                    ))
                  )}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>

          <Field.Root flex="1" invalid={fieldInvalid} gap={0.5}>
            <Textarea
              ref={inputRef}
              value={source}
              onChange={handleChange}
              placeholder={placeholder}
              autoComplete="off"
              rows={1}
              resize="none"
              overflow="hidden"
              size="sm"
              // visually similar to other inputs when short
              minH="2.5rem"
            />
            {error ? (
              <Field.ErrorText fontSize="xs" color="red.500">
                {error}
              </Field.ErrorText>
            ) : null}
            {!error && hasMissingVariables ? (
              <Field.ErrorText fontSize="xs" color="red.500">
                Unknown variables: {missingVariableNames.join(", ")}
              </Field.ErrorText>
            ) : null}
          </Field.Root>
        </HStack>
      ) : (
        <Box
          fontSize="sm"
          fontFamily="mono"
          color={previewParts.hasContent ? undefined : "fg.muted"}
          whiteSpace="normal"
          wordBreak="break-word"
        >
          {previewParts.hasContent
            ? previewParts.parts.map((part, idx) =>
                part.varName ? (
                  <Tag.Root
                    key={`${part.varName}-${idx}`}
                    size="sm"
                    variant={
                      missingVariablesSet.has(part.varName) ? "solid" : "subtle"
                    }
                    colorPalette={
                      missingVariablesSet.has(part.varName) ? "red" : "blue"
                    }
                    display="inline-flex"
                    alignItems="center"
                    mx={0.5}
                    // make the tag text match the surrounding text size
                    fontSize="inherit"
                    lineHeight="inherit"
                    verticalAlign="baseline"
                  >
                    <Tag.Label fontSize="inherit" fontWeight="bold" lineHeight="inherit">
                      {part.varName}
                    </Tag.Label>
                  </Tag.Root>
                ) : (
                  <React.Fragment key={`${part.text}-${idx}`}>
                    {part.text}
                  </React.Fragment>
                )
              )
            : "No expression"}
        </Box>
      )}
    </FieldContainer>
  );
};

export default ExpressionExpressionField;
