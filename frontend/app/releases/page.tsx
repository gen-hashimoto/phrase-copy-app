import { Metadata } from "next"
import Link from "next/link"

import { AppShellServer } from "@/components/app-shell-server"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { fetchMe } from "@/lib/fetch-me"
import { releases } from "@/lib/releases"

export const metadata: Metadata = {
  title: "Release Notes",
}

export default async function ReleasePage() {
  const me = await fetchMe()

  return (
    <AppShellServer user={me} showLoginButton={me === null}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Release Notes</CardTitle>
          <CardDescription>What changed in each version.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 text-sm leading-relaxed">
          {releases.map((release) => (
            <section key={release.version} className="space-y-2">
              <div className="space-y-2">
                <h2 className="text-base font-semibold">
                  <Link
                    href={`/releases/${release.version}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {release.version}
                  </Link>
                </h2>
                <p>{release.date}</p>
              </div>
              <ul className="list-disc space-y-1 pl-5">
                {release.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}

          <Button variant="link" asChild className="h-auto p-0">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </AppShellServer>
  )
}
