import React from "react";
import { Box, Button, Stack, Text } from "@chakra-ui/react";

import type { Program, ProgramInput } from "../lib/calc";
import InputEditor from "./InputEditor";

type ProgramInputsEditorProps = {
  program: Program;
  setProgram: (next: Program) => void;
};

const createDefaultInput = (index: number): ProgramInput => ({
  name: `input${index + 1}`,
  description: "",
  type: "float",
  default: 0,
  units: undefined,
  step: 0.01,
  group: "General",
});

const ProgramInputsEditor: React.FC<ProgramInputsEditorProps> = ({
  program,
  setProgram,
}) => {
  const handleInputChange = (inputIndex: number, next: ProgramInput) => {
    const nextInputs = program.inputs.map((input, index) =>
      index === inputIndex ? next : input
    );
    setProgram({ ...program, inputs: nextInputs });
  };

  const handleAddInput = () => {
    const nextInputs = [...program.inputs, createDefaultInput(program.inputs.length)];
    setProgram({ ...program, inputs: nextInputs });
  };

  return (
    <Stack gap={4} w="full" fontSize="xs" lineHeight="shorter">
      {program.inputs.length === 0 ? (
        <Box border="1px" borderColor="border.subtle" borderRadius="md" p={3}>
          <Text color="fg.muted">No inputs defined yet.</Text>
        </Box>
      ) : (
        program.inputs.map((input, index) => (
          <Box
            key={`${input.name}-${index}`}
            border="1px"
            borderColor="border.subtle"
            borderRadius="md"
            p={3}
            bg="green.200"
          >
            <Stack gap={3}>
              <InputEditor
                value={input}
                onChange={(next) => handleInputChange(index, next)}
              />
            </Stack>
          </Box>
        ))
      )}
      <Button
        variant="outline"
        size="sm"
        alignSelf="flex-start"
        onClick={handleAddInput}
      >
        Add input
      </Button>
    </Stack>
  );
};

export default ProgramInputsEditor;
