"use client"

import { type LucideIcon } from "lucide-react"
import { useEffect, useState } from "react"

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

function useCanHover() {
  const [canHover, setCanHover] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)")

    function syncCanHover() {
      setCanHover(query.matches)
    }

    syncCanHover()
    query.addEventListener("change", syncCanHover)

    return () => {
      query.removeEventListener("change", syncCanHover)
    }
  }, [])

  return canHover
}

function IconButtonOnly({
  label,
  icon: Icon,
  variant = "ghost",
  onClick,
  disabled,
}: IconActionButtonProps) {
  return (
    <Button
      aria-label={label}
      className="size-10 sm:size-8"
      disabled={disabled}
      onClick={onClick}
      size="icon"
      type="button"
      variant={variant}
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
    </Button>
  )
}

export function IconActionButton(props: IconActionButtonProps) {
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

