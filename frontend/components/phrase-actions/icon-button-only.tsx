"use client"

import { type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = Omit<
  React.ComponentProps<typeof Button>,
  "aria-label" | "children" | "size" | "type"
> & {
  label: string
  icon: LucideIcon
}

export function IconButtonOnly({
  label,
  icon: Icon,
  variant = "ghost",
  className,
  ...buttonProps
}: Props) {
  return (
    <Button
      // TooltipTrigger asChild injects hover/focus handlers into this component.
      // Forward them to the real button so Radix can open the tooltip.
      {...buttonProps}
      aria-label={label}
      className={cn(className)}
      size="icon"
      type="button"
      variant={variant}
    >
      <Icon aria-hidden="true" />
    </Button>
  )
}
