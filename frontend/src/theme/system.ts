import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react"

// Chakra UI v3 system configuration
// Sets default colorPalette to blue for common interactive components
export const system = createSystem(
  defaultConfig,
  defineConfig({
    theme: {
      recipes: {
        button: {
          defaultVariants: {
            colorPalette: "blue",
          },
        },
        menu: {
          defaultVariants: {
            colorPalette: "blue",
          },
        },
      },
      tokens: {
        colors: {
          // Expose a brand alias that maps to blue scale
          brand: {
            50: { value: "{colors.blue.50}" },
            100: { value: "{colors.blue.100}" },
            200: { value: "{colors.blue.200}" },
            300: { value: "{colors.blue.300}" },
            400: { value: "{colors.blue.400}" },
            500: { value: "{colors.blue.500}" },
            600: { value: "{colors.blue.600}" },
            700: { value: "{colors.blue.700}" },
            800: { value: "{colors.blue.800}" },
            900: { value: "{colors.blue.900}" },
          },
        },
      },
      semanticTokens: {
        colors: {
          primary: { value: "{colors.blue.500}" },
          primaryFg: { value: { base: "white", _dark: "{colors.blue.50}" } },
        },
      },
    },
  }),
)
