"use client"

import React from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { system } from "../../theme/system"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { useTheme } from "next-themes"

function ThemeRoot({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  const mode = resolvedTheme ?? "light"
  return <div className={`chakra-theme ${mode}`}>{children}</div>
}

export function Provider({ children, ...props }: React.PropsWithChildren<ColorModeProviderProps>) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider attribute="class" disableTransitionOnChange {...props}>
        <ThemeRoot>{children}</ThemeRoot>
      </ColorModeProvider>
    </ChakraProvider>
  )
}
