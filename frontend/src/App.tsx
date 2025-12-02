import type React from 'react'

import { useQuery } from '@tanstack/react-query';

import { Box, Button, Container, Text } from '@chakra-ui/react';
import TopNav from './components/TopNav';
import CalcTest from './components/CalcTest';

const App: React.FC = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const r = await fetch('/auth/me');
      return r.json();
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (data?.authorized === false) {
    return (
      <Box>
        <TopNav />
        <Container py={6} maxW="3xl">
          <Text mb={4} fontSize="xl" fontWeight="semibold">
            User not authorized
          </Text>
          <a href="/auth/google">
            <Button variant="solid">Login with Google</Button>
          </a>
        </Container>
      </Box>
    );
  }

  return (
    <Box p={0} m={0}>
      <TopNav user={data?.user} />
      <Container m={0} p={0} w="full">
        <CalcTest />
      </Container>
    </Box>
  );
}

export default App
