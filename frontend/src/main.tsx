import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// Chakra v3 doesn't require a manual style.css import.
import { Provider } from './components/ui/provider'
// theme system and next-themes are wired via Provider

import App from './App.tsx'
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
