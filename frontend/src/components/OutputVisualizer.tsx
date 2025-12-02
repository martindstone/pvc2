import React from 'react';
import { Box, SimpleGrid, Text, Heading, VStack } from '@chakra-ui/react';
import type { ProgramOutput } from '../lib/calc';

function formatCurrency(n: number) {
  if (!isFinite(n)) return '—';
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function formatNumber(n: number, decimals = 2) {
  if (!isFinite(n)) return '—';
  return n.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: 0 });
}

function formatPercent(n: number, decimals = 1) {
  if (!isFinite(n)) return '—';
  return `${n.toLocaleString(undefined, { maximumFractionDigits: decimals })}%`;
}

const precisionFor = (o: ProgramOutput) => {
  if (o.type === 'integer') return 0;
  if (o.units === 'percent') return 1;
  if (o.units === 'months') return 1;
  if (o.units === 'currency') return 0;
  return 2;
};

export interface OutputVisualizerProps {
  outputs: ProgramOutput[] | null;
  suppressZeroes?: boolean;
}

export const OutputVisualizer: React.FC<OutputVisualizerProps> = ({ outputs, suppressZeroes }) => {
  if (!outputs) return <Text>No output</Text>;
  const groups: Record<string, ProgramOutput[]> = {};
  for (const o of outputs) {
    const g = (o.group || 'General') as string;
    if (!groups[g]) groups[g] = [];
    groups[g].push(o);
  }

  return (
    <VStack align="stretch" gap={4}>
      {Object.entries(groups).map(([group, outs]) => (
        <Box key={group} borderWidth={1} borderRadius="md" p={4}>
          <Heading size="sm">{group}</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} style={{ marginTop: 12 }}>
            {outs.map((o) => {
              const raw = typeof o.value === 'number' ? o.value : Number(o.value as any);
              if (suppressZeroes && raw === 0) {
                return null;
              }
              const prec = precisionFor(o);
              let display = '—';
              if (Number.isFinite(raw)) {
                if (o.units === 'currency') display = formatCurrency(raw);
                else if (o.units === 'percent') display = formatPercent(raw, prec);
                else display = formatNumber(raw, prec) + (o.units ? ` ${o.units}` : '');
              }

              return (
                <Box key={o.name} borderWidth={1} borderRadius="md" p={4}>
                  {/* <Heading size="sm">{o.name}</Heading> */}
                  <Text fontSize="sm" color="gray.600" mb={2}>{o.description}</Text>
                  <Text fontSize="2xl" fontWeight={700}>{display}</Text>
                  {/* {o.units ? <Text fontSize="sm" color="gray.500" mt={1}>{o.units}</Text> : null} */}
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      ))}
    </VStack>
  );
};

export default OutputVisualizer;
