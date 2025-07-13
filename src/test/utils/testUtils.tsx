import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything from @testing-library/react
export * from '@testing-library/react'
export { customRender as render }

// Re-export screen and fireEvent using require for compatibility
export const screen = require('@testing-library/react').screen
export const fireEvent = require('@testing-library/react').fireEvent

// Create a simple waitFor implementation for testing
export const waitFor = async (callback: () => void | Promise<void>, options?: { timeout?: number }) => {
  const timeout = options?.timeout || 1000
  const start = Date.now()
  
  while (Date.now() - start < timeout) {
    try {
      await callback()
      return
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 10))
    }
  }
  
  // Final attempt
  await callback()
}