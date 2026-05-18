/**
 * Detect double-tap on touch devices (approximate dblclick).
 * Returns a handler to attach to onTouchEnd.
 */

export function createDoubleTapHandler(
  onDoubleTap: () => void,
  maxIntervalMs = 300
): () => void {
  let lastTapAt = 0

  return () => {
    const now = Date.now()
    if (now - lastTapAt <= maxIntervalMs) {
      lastTapAt = 0
      onDoubleTap()
      return
    }
    lastTapAt = now
  }
}
