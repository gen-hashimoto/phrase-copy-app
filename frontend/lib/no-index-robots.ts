import type { Metadata } from "next"

export const noIndexRobots: Pick<Metadata, "robots"> = {
  robots: { index: false, follow: false },
}
