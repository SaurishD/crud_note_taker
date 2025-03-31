"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const isLandingPage = false // You can modify this logic based on your needs

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={isLandingPage ? "dark" : "system"}
      forcedTheme={isLandingPage ? "dark" : undefined}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
} 