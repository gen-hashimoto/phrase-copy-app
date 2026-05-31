"use client"

import {
  Check,
  ClipboardCopy,
  Save,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type IconActionButtonProps = {
  label: string
  icon: LucideIcon
  variant?: React.ComponentProps<typeof Button>["variant"]
  onClick?: () => void
}

function IconActionButton({
  label,
  icon: Icon,
  variant = "ghost",
  onClick,
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
        >
          <Icon aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export function PhraseIconActionsSample() {
  return (
    <TooltipProvider delayDuration={300}>
      <section className="mx-auto flex max-w-xl flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground">
        <div>
          <h2 className="text-base font-medium">Phrase actions</h2>
          <p className="text-sm text-muted-foreground">
            PC とスマホの両方でアイコンのみを表示し、意味は Tooltip と
            aria-label で補います。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <IconActionButton icon={ClipboardCopy} label="Copy phrase" />
          <IconActionButton icon={Trash2} label="Delete phrase" variant="destructive" />
          <IconActionButton icon={Save} label="Save changes" />
          <IconActionButton icon={X} label="Cancel editing" />
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-muted p-2">
          <Check aria-hidden="true" className="size-4 text-green-600" />
          <span className="text-sm text-muted-foreground">
            Copy 成功時は Toast ではなく、一時的なアイコン変化だけにします。
          </span>
        </div>
      </section>
    </TooltipProvider>
  )
}
