/**
 * FastAPI PhraseRead に対応（GET /phrases の配列要素）
 * created_at は JSON では文字列になるため string としている。
 */
export type PhraseRead = {
  id: number
  title: string
  content: string
  created_at: string
}
