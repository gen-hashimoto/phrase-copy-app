"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type AddPhraseControlProps = {
  disabled: boolean
  onAdd: () => void
}

export function AddPhraseControl({ disabled, onAdd }: AddPhraseControlProps) {
  return (
    <Button
      aria-label="フレーズを追加"
      className="size-11 sm:size-8"
      disabled={disabled}
      onClick={onAdd}
      size="icon"
      type="button"
      variant="outline"
    >
      <Plus aria-hidden="true" className="h-4 w-4" />
    </Button>
  )
}

type MagicLinkSubmitButtonProps = {
  isSubmitting: boolean
}

export function MagicLinkSubmitButton({
  isSubmitting,
}: MagicLinkSubmitButtonProps) {
  return (
    <Button
      className="w-full sm:w-auto"
      disabled={isSubmitting}
      size="sm"
      type="submit"
    >
      {isSubmitting ? "Sending..." : "Send Magic Link"}
    </Button>
  )
}

export function LoginFormButtonSizeSample({
  email,
  isSubmitting,
  onEmailChange,
  onSubmit,
}: {
  email: string
  isSubmitting: boolean
  onEmailChange: (value: string) => void
  onSubmit: () => void
}) {
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <label className="flex flex-col gap-1 text-sm">
        Email
        <Input
          autoComplete="email"
          onChange={(event) => onEmailChange(event.target.value)}
          required
          type="email"
          value={email}
        />
      </label>

      <div className="flex sm:justify-start">
        <MagicLinkSubmitButton isSubmitting={isSubmitting} />
      </div>
    </form>
  )
}

