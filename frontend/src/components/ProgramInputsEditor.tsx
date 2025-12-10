import React from "react";
import { Box, Button, Heading, Stack } from "@chakra-ui/react";

import type { Program, ProgramInput } from "../lib/calc";
import InputEditor from "./InputEditor";

type ProgramInputsEditorProps = {
  program: Program;
  setProgram: (next: Program) => void;
};

const createNewInput = (index: number): ProgramInput => ({
  name: `input${index + 1}`,
  description: "",
  type: "float",
  default: 0,
});

export const ProgramInputsEditor: React.FC<ProgramInputsEditorProps> = ({
  program,
  setProgram,
}) => {
  return (
    <Stack gap={8}>
      <Stack gap={6}>
        <Heading size="md">Program inputs</Heading>
        {program.inputs.map((_, index) => (
          <Box
            key={`${index}-${program.inputs[index]?.name ?? "input"}`}
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            p={4}
          >
            <InputEditor program={program} setProgram={setProgram} index={index} />
          </Box>
        ))}
        <Button
          onClick={() => {
            const newInput = createNewInput(program.inputs.length);
            setProgram({ ...program, inputs: [...program.inputs, newInput] });
          }}
        >
          Add input
        </Button>
      </Stack>
    </Stack>
  );
};

export default ProgramInputsEditor;
