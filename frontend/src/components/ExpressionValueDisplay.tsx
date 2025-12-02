// components/ExpressionValueDisplay.tsx
import React, { useMemo } from "react";
import { Box, Stack, Text } from "@chakra-ui/react";

type Props = {
  label: string;
  result?: number | null;
  fieldInvalid: boolean;
};

export const ExpressionValueDisplay: React.FC<Props> = ({
  label,
  result,
  fieldInvalid,
}) => {
  const formattedResult = useMemo(() => {
    if (result === null || result === undefined) return "—";
    return Number.isFinite(result) ? result.toString() : "—";
  }, [result]);

  return (
    <Box w="full">
      <Stack
        gap={1}
        p={3}
        borderRadius="md"
        borderWidth="1px"
        borderColor="border.subtle"
        bg="bg.subtle"
      >
        <Text
          fontSize="xs"
          color="fg.muted"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          {label}
        </Text>
        <Text
          fontSize="2xl"
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
