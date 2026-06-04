"use client"

import { type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type IconActionButtonProps = {
  label: string
  icon: LucideIcon
  variant?: React.ComponentProps<typeof Button>["variant"]
  onClick?: () => void
  disabled?: boolean
}

export function IconActionButton({
  label,
  icon: Icon,
  variant = "ghost",
  onClick,
  disabled,
}: IconActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={label}
          onClick={onClick}
          size="icon"
          type="button"
          variant={variant}
          disabled={disabled}
        >
          <Icon aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
