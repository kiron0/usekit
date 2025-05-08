import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { siteConfig } from "@/config/site"
import { getTableOfContents } from "@/lib/toc"
import { absoluteUrl } from "@/lib/utils"
import { allDocs } from "@/contentlayer/generated"

import "@/styles/mdx.css"

import { getBaseURL } from "@/lib/baseUrl"
import { DocsDetails } from "@/components/docs-details"

interface DocPageProps {
  params: {
    slug: string[]
  }
}

async function getDocFromParams({ params }: DocPageProps) {
  const slug = params.slug?.join("/") || ""
  const doc = allDocs.find((doc) => doc.slugAsParams === slug)

  if (!doc) {
    return null
  }

  return doc
}

export async function generateMetadata(props: {
  params: Promise<DocPageProps["params"]>
}): Promise<Metadata> {
  const BASE_URL = await getBaseURL()

  const params = await props.params
  const doc = await getDocFromParams({ params })

  if (!doc) {
    return {
      title: "Not Found",
      description: "The page you are looking for doesn't exist.",
    }
  }

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: "article",
      url: await absoluteUrl(doc.slug),
      images: [
        {
          url: new URL("/og.png", BASE_URL),
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
      images: [new URL("/og.png", BASE_URL)],
      creator: siteConfig.links.twitter,
    },
  }
}

export async function generateStaticParams(): Promise<
  DocPageProps["params"][]
> {
  return allDocs.map((doc) => ({
    slug: doc.slugAsParams.split("/"),
  }))
}

export default async function DocPage(props: {
  params: Promise<DocPageProps["params"]>
}) {
  const params = await props.params

  const doc = await getDocFromParams({ params })

  if (!doc) {
    notFound()
  }

  const toc = await getTableOfContents(doc.body.raw)

  return <DocsDetails doc={doc} toc={toc} />
}
