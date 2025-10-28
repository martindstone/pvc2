import type React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'

import User from './components/User'

const App: React.FC = () => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <User />
    </QueryClientProvider>
  )
}

export default App
