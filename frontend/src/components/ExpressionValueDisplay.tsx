// components/ExpressionValueDisplay.tsx
import React, { useMemo } from "react";
import { Box, Stack, Text } from "@chakra-ui/react";

type Props = {
  label: string;
  result?: number | null;
  fieldInvalid: boolean;
  density?: "default" | "compact";
};

export const ExpressionValueDisplay: React.FC<Props> = ({
  label,
  result,
  fieldInvalid,
  density = "default",
}) => {
  const formattedResult = useMemo(() => {
    if (result === null || result === undefined) return "—";
    return Number.isFinite(result) ? result.toString() : "—";
  }, [result]);

  const isCompact = density === "compact";

  return (
    <Box w="full">
      <Stack
        gap={isCompact ? 0.5 : 1}
        px={isCompact ? 2 : 3}
        py={isCompact ? 1.5 : 3}
        borderRadius="md"
        borderWidth="1px"
        borderColor="border.subtle"
        bg="bg.subtle"
      >
        <Text
          fontSize={isCompact ? "2xs" : "xs"}
          color="fg.muted"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          {label}
        </Text>
        <Text
          fontSize={isCompact ? "lg" : "2xl"}
          fontWeight="semibold"
          fontFamily="mono"
          color={fieldInvalid ? "red.500" : undefined}
        >
          {fieldInvalid ? "Invalid expression" : formattedResult}
        </Text>
      </Stack>
    </Box>
  );
};

export default ExpressionValueDisplay;
