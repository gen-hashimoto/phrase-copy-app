import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

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
import { getRelease, releases } from "@/lib/releases"

type Props = {
  params: Promise<{ version: string }>
}

export async function generateStaticParams() {
  return releases.map((r) => ({ version: r.version }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { version } = await params
  const release = getRelease(version)
  if (!release) {
    return { title: "Release Notes" }
  }
  return { title: `${release.version} Release Notes` }
}

export default async function ReleaseDetailPage({ params }: Props) {
  const { version } = await params
  const release = getRelease(version)
  if (!release) {
    notFound()
  }

  const me = await fetchMe()

  return (
    <AppShellServer user={me} showLoginButton={me === null}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{release.version}</CardTitle>
          <CardDescription>
            Released
            <br />
            {release.date}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-relaxed">
          {release.sections.map((section) => (
            <section key={section.title} className="space-y-2">
              <h2 className="text-base font-semibold">{section.title}</h2>
              <ul className="list-disc space-y-1 pl-5">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <Button variant="link" asChild className="h-auto p-0">
              <Link href="/releases">All Release Notes</Link>
            </Button>
            <Button variant="link" asChild className="h-auto p-0">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppShellServer>
  )
}
