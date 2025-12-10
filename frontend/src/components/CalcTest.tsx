import type React from "react";
import { useState } from "react";

import {
  Accordion,
  Box,
  Flex,
  Heading,
  HStack,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { program as defaultProgram } from "./savedCalcs";

import ProgramInputsEditor from "./ProgramInputsEditor";
import ProgramStepsEditor from "./ProgramStepsEditor";

export const CalcTest: React.FC = () => {
  const [program, setProgram] = useState(defaultProgram);
  const inputCount = program.inputs.length;
  const stepCount = program.steps.length;

  return (
    <Box
      bg="bg.canvas"
      minH="100vh"
      h={{ base: "auto", lg: "100vh" }}
      p={{ base: 4, lg: 6 }}
      overflow={{ base: "auto", lg: "hidden" }}
    >
      <Flex
        w="full"
        maxW="1440px"
        mx="auto"
        gap={{ base: 6, lg: 8 }}
        align="stretch"
        direction={{ base: "column", lg: "row" }}
        h={{ base: "auto", lg: "100%" }}
      >
        <Box
          w={{ base: "100%", lg: "33.33%" }}
          maxW="520px"
          flexShrink={0}
          h={{ base: "auto", lg: "100%" }}
          overflowY={{ base: "visible", lg: "auto" }}
          pr={{ base: 0, lg: 2 }}
        >
          <Stack gap={3} fontSize="xs" lineHeight="shorter">
            <Heading size="md">Program Builder</Heading>
          <Accordion.Root
            multiple
            collapsible
            defaultValue={["inputs", "steps"]}
            display="flex"
            flexDirection="column"
            gap={3}
          >
            <Accordion.Item value="inputs">
              <Box
                borderWidth="1px"
                borderRadius="lg"
                bg="bg.surface"
                borderColor="border.subtle"
                overflow="hidden"
              >
                <Accordion.ItemTrigger
                  px={3}
                  py={2}
                  fontWeight="semibold"
                  justifyContent="space-between"
                  display="flex"
                  alignItems="center"
                  textAlign="left"
                >
                  <Text fontSize="sm" fontWeight="semibold">
                    Program Inputs
                  </Text>
                  <HStack gap={2} align="center">
                    <Accordion.ItemContext>
                      {({ expanded }) =>
                        !expanded ? (
                          <Tag.Root size="sm" variant="solid" colorPalette="gray">
                            <Tag.Label>{inputCount}</Tag.Label>
                          </Tag.Root>
                        ) : null
                      }
                    </Accordion.ItemContext>
                    <Accordion.ItemIndicator />
                  </HStack>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody px={3} py={3}>
                    <ProgramInputsEditor
                      program={program}
                      setProgram={setProgram}
                    />
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Box>
            </Accordion.Item>

            <Accordion.Item value="steps">
              <Box
                borderWidth="1px"
                borderRadius="lg"
                bg="bg.surface"
                borderColor="border.subtle"
                overflow="hidden"
              >
                <Accordion.ItemTrigger
                  px={3}
                  py={2}
                  fontWeight="semibold"
                  justifyContent="space-between"
                  display="flex"
                  alignItems="center"
                  textAlign="left"
                >
                  <Text fontSize="sm" fontWeight="semibold">
                    Program Steps
                  </Text>
                  <HStack gap={2} align="center">
                    <Accordion.ItemContext>
                      {({ expanded }) =>
                        !expanded ? (
                          <Tag.Root size="sm" variant="solid" colorPalette="gray">
                            <Tag.Label>{stepCount}</Tag.Label>
                          </Tag.Root>
                        ) : null
                      }
                    </Accordion.ItemContext>
                    <Accordion.ItemIndicator />
                  </HStack>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody px={3} py={3}>
                    <ProgramStepsEditor
                      program={program}
                      setProgram={setProgram}
                    />
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Box>
            </Accordion.Item>
          </Accordion.Root>
          </Stack>
        </Box>

        <Box
          flex="1"
          h={{ base: "auto", lg: "100%" }}
          overflowY={{ base: "visible", lg: "auto" }}
          pl={{ base: 0, lg: 2 }}
        >
          <Box
            minH={{ base: "200px", lg: "100%" }}
            borderWidth="1px"
            borderRadius="lg"
            borderStyle="dashed"
            borderColor="border.subtle"
            bg="bg.subtle"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="fg.muted"
            fontStyle="italic"
            fontSize="sm"
            px={4}
            py={6}
          >
            <Text>Reserved for future outputs</Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default CalcTest;
