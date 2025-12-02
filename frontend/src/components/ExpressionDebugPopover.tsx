// components/ExpressionDebugPopover.tsx
import React from "react";
import {
  CloseButton,
  Code,
  IconButton,
  Popover,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { PiBugBeetleBold } from "react-icons/pi";
import type { ExpressionEditorValue } from "./ExpressionEditor";

type Props = {
  value: ExpressionEditorValue;
  scope?: Record<string, number>;
};

export const ExpressionDebugPopover: React.FC<Props> = ({ value, scope }) => (
  <Popover.Root positioning={{ placement: "top" }}>
    <Popover.Trigger asChild>
      <IconButton
        aria-label="Expression debug info"
        size="sm"
        variant="ghost"
      >
        <PiBugBeetleBold />
      </IconButton>
    </Popover.Trigger>
    <Portal>
      <Popover.Positioner>
        <Popover.Content maxW="sm">
          <Popover.Arrow />
          <Popover.CloseTrigger asChild>
            <CloseButton size="sm" position="absolute" top="2" insetEnd="2" />
          </Popover.CloseTrigger>
          <Popover.Header fontWeight="semibold">
            Debug info
          </Popover.Header>
          <Popover.Body>
            <Stack gap={3} fontSize="xs">
              <Stack gap={1}>
                <Text fontSize="xs" color="fg.muted">
                  Stored JSON
                </Text>
                <Code whiteSpace="pre" fontSize="xs">
                  {JSON.stringify(value, null, 2)}
                </Code>
              </Stack>
              {scope ? (
                <Stack gap={1}>
                  <Text fontSize="xs" color="fg.muted">
                    Scope
                  </Text>
                  <Code whiteSpace="pre" fontSize="xs">
                    {JSON.stringify(scope, null, 2)}
                  </Code>
                </Stack>
              ) : null}
            </Stack>
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Portal>
  </Popover.Root>
);

export default ExpressionDebugPopover;