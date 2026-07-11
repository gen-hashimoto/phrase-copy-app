"use client"

import { Check, Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
]

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const hydrated = useHydrated()

  if (!hydrated) {
    return (
      <Button
        aria-label="Select theme"
        disabled
        size="icon"
        type="button"
        variant="ghost"
      >
        <Sun aria-hidden="true" />
      </Button>
    )
  }

  const currentTheme = theme ?? "system"
  const Icon = resolvedTheme === "dark" ? Moon : Sun

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Select theme"
          size="icon"
          type="button"
          variant="ghost"
        >
          <Icon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themeOptions.map((option) => {
          const Icon = option.icon
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
            >
              <Icon aria-hidden="true" />
              <span>{option.label}</span>
              {currentTheme === option.value ? (
                <Check aria-hidden="true" className="ml-auto" />
              ) : null}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
