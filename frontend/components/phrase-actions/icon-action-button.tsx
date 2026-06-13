"use client"

import { type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { IconButtonOnly } from "@/components/phrase-actions/icon-button-only"
import { useCanHover } from "@/hooks/use-can-hover"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Props = {
  label: string
  icon: LucideIcon
  variant?: React.ComponentProps<typeof Button>["variant"]
  onClick?: () => void
  disabled?: boolean
}

export function IconActionButton(props: Props) {
  const canHover = useCanHover()

  if (!canHover) {
    return <IconButtonOnly {...props} />
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButtonOnly {...props} />
      </TooltipTrigger>
      <TooltipContent>{props.label}</TooltipContent>
    </Tooltip>
  )
}
