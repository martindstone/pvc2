import React from 'react';
import { Checkbox, Collapsible, Box, Field, VStack, Heading, HStack, NumberInput, Slider, Text, SimpleGrid, Button } from '@chakra-ui/react';
import { LuChevronRight } from "react-icons/lu";

import {
  getCurrencyCodeFromLocale,
} from '../lib/util';
import type { Program, ProgramInput } from '../lib/calc';

type Values = Record<string, number | boolean>;

export interface ProgramEditorProps {
  program: Program;
  values: Values;
  onChange: (values: Values) => void;
}

const groupInputs = (inputs: ProgramInput[]) => {
  const map: Record<string, ProgramInput[]> = {};
  for (const inp of inputs) {
    const g = inp.group || 'General';
    if (!map[g]) map[g] = [];
    map[g].push(inp);
  }
  return map;
};

const ChakraSlider: React.FC<{
  inp: ProgramInput;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}> = ({ inp, value, onChange, min = 0, max = 1, step = 0.01 }) => {
  return (
    <Slider.Root
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={(e) => onChange(e.value[0])}
    >
      <HStack justify="space-between">
        <Slider.Label>{inp.description || 'Chakra Slider'}</Slider.Label>
        <Text fontWeight="bold">{Math.round(value * 100)}%</Text>
      </HStack>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.Root>
  );
};

const ChakraNumberInput: React.FC<{
  inp: ProgramInput;
  value: number;
  onChange: (value: number) => void;
}> = ({ inp, value, onChange }) => {
  const rootProps: {
    value: string;
    onValueChange: (event: { valueAsNumber: number }) => void;
    step?: number;
  } = {
    value: `${value}`,
    onValueChange: (event) => {
      onChange(event.valueAsNumber);
    }
  };
  if (inp.step !== undefined) {
    rootProps.step = inp.step;
  }

  const additionalChildren: React.ReactNode[] = [];
  if (inp.type === 'integer' || inp.step !== undefined) {
    additionalChildren.push(<NumberInput.Control key="control" />);
  }
  if (inp.units) {
    additionalChildren.push(
      <Box
        position="absolute"
        right={inp.type === 'integer' || inp.step !== undefined ? "2.25rem" : "0.75rem"}
        top="50%"
        transform="translateY(-50%)"
        pointerEvents="none"
        color="fg.muted"
        fontSize="sm"
      >
        {inp.units === 'currency' ? getCurrencyCodeFromLocale() : inp.units}
      </Box>
    );
  }
  return (
    <Field.Root>
      <Field.Label>{inp.description ?? inp.name}</Field.Label>
      <NumberInput.Root {...rootProps}>
        <NumberInput.Input />
        {additionalChildren}
      </NumberInput.Root>
    </Field.Root>
  );
}

const ChakraCheckbox: React.FC<{
  inp: ProgramInput;
  value: number;
  onChange: (value: number) => void;
}> = ({ inp, value, onChange }) => {
  return (
    <Checkbox.Root
      checked={Boolean(value)}
      onCheckedChange={(e) => onChange(e.checked ? 1 : 0)}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label ml={2}>{inp.description || inp.name}</Checkbox.Label>
    </Checkbox.Root>
    // <Box>
    //   <label htmlFor={inp.name}>
    //     <Text fontSize="sm" color="red.500" mb={2}>{inp.description}</Text>
    //   </label>
    //   <input
    //     id={inp.name}
    //     type="checkbox"
    //     checked={Boolean(value)}
    //     onChange={(e) => onChange(e.target.checked ? 1 : 0)}
    //   />
    // </Box>
  );
};

export const ProgramEditor: React.FC<ProgramEditorProps> = ({ program, values, onChange }) => {
  const groups = groupInputs(program.inputs || []);

  const setValue = (name: string, v: number | boolean) => {
    onChange({ ...values, [name]: v });
  };

  const resetToDefaults = (group?: string) => {
    const next = { ...values };
    for (const inp of program.inputs) {
      if (!group || (inp.group || 'General') === group) next[inp.name] = inp.default;
    }
    onChange(next);
  };

  return (
    <VStack align="stretch" gap={2}>
      {Object.entries(groups).map(([group, inputs]) => (
        <Collapsible.Root key={group} borderWidth={1} borderRadius="md" p={2}>
          <Collapsible.Trigger
            paddingY="3"
            display="flex"
            gap="2"
            alignItems="center"
          >
            <Collapsible.Indicator
              transition="transform 0.2s"
              _open={{ transform: "rotate(90deg)" }}
            >
              <LuChevronRight />
            </Collapsible.Indicator>
            {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}> */}
            <Heading size="sm">{group}</Heading>
            {/* </div> */}
          </Collapsible.Trigger>

          <Collapsible.Content>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              {inputs.map((inp) => {
                const current = values && inp.name in values ? values[inp.name] : inp.default;
                return (
                  <Box key={inp.name}>
                    {inp.type === 'boolean' ? (
                      <ChakraCheckbox
                        inp={inp}
                        value={current as number}
                        onChange={(n) => setValue(inp.name, n)}
                      />
                    ) : inp.units === 'percent' ? (
                      // <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      //   <input
                      //     id={inp.name}
                      //     type="range"
                      //     min={0}
                      //     max={1}
                      //     step={0.01}
                      //     value={typeof current === 'number' ? String(current) : String(0)}
                      //     onChange={(e) => {
                      //       const n = Number(e.target.value);
                      //       setValue(inp.name, Number.isNaN(n) ? 0 : n);
                      //     }}
                      //   />
                      //   <div style={{ minWidth: 56, textAlign: 'right' }}>{typeof current === 'number' ? `${Math.round(current * 100)}%` : '0%'}</div>
                      // </div>
                      <ChakraSlider
                        inp={inp}
                        value={values?.[inp.name] as number ?? 0}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={(n) => setValue(inp.name, n)}
                      />
                    ) : (
                      // <>
                      //   <label htmlFor={inp.name}>
                      //     {/* <Text fontWeight={600} mb={1}>{inp.name}</Text> */}
                      //     <Text fontSize="sm" color="gray.500" mb={2}>{inp.description}</Text>
                      //   </label>
                      //   <Input
                      //     id={inp.name}
                      //     type="number"
                      //     value={typeof current === 'number' ? String(current) : String(current)}
                      //     onChange={(e) => {
                      //       const n = Number(e.target.value);
                      //       setValue(inp.name, Number.isNaN(n) ? 0 : (inp.type === 'integer' ? Math.round(n) : n));
                      //     }}
                      //   />
                      // </>
                      <ChakraNumberInput
                        inp={inp}
                        value={values?.[inp.name] as number ?? 0}
                        onChange={(n) => setValue(inp.name, inp.type === 'integer' ? Math.round(n) : n)}
                      />
                    )}
                  </Box>
                );
              })}
            </SimpleGrid>
          </Collapsible.Content>
        </Collapsible.Root>
      ))}


      <hr />

      <Button onClick={() => resetToDefaults()}>Reset All Defaults</Button>
    </VStack>
  );
};

export default ProgramEditor;
