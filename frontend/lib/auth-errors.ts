export function mapVerifyError(detail: unknown): string {
  if (typeof detail === "object" && detail !== null && "code" in detail) {
    switch (detail.code) {
      case "TOKEN_INVALID":
        return "無効なリンクです。"
      case "TOKEN_EXPIRED":
        return "リンクの有効期限が切れています。"
      case "TOKEN_USED":
        return "このリンクはすでに使用されています。"
      case "RATE_LIMITED":
        return "しばらく待ってから再度お試しください。"
    }
  }

  if (typeof detail === "string") {
    switch (detail) {
      case "Invalid magic link":
        return "無効なリンクです。"
      case "Magic link expired":
        return "リンクの有効期限が切れています。"
      case "Magic link already used":
        return "このリンクはすでに使用されています。"
    }
  }

  return "ログインに失敗しました。"
}

// TODO: 未実装- login-form と auth-errors.ts の統一
