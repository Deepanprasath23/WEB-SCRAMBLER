import { type NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"

type ScrambleType = "letters" | "words" | "sentences" | "links" | "images"

interface ScrambleRequest {
  url: string
  scrambleType: ScrambleType
}

// Scrambling utility functions
function scrambleLetters(text: string): string {
  return text
    .split("")
    .map((char) => {
      if (char.match(/[a-zA-Z]/)) {
        // Only scramble letters, preserve other characters
        const chars = text.match(/[a-zA-Z]/g) || []
        const randomIndex = Math.floor(Math.random() * chars.length)
        return chars[randomIndex]
      }
      return char
    })
    .join("")
}

function scrambleWords(text: string): string {
  const words = text.split(/(\s+)/)
  const actualWords = words.filter((word) => word.trim().length > 0 && word.match(/[a-zA-Z]/))

  // Fisher-Yates shuffle for words
  for (let i = actualWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[actualWords[i], actualWords[j]] = [actualWords[j], actualWords[i]]
  }

  let wordIndex = 0
  return words
    .map((segment) => {
      if (segment.trim().length > 0 && segment.match(/[a-zA-Z]/)) {
        return actualWords[wordIndex++] || segment
      }
      return segment
    })
    .join("")
}

function scrambleSentences(text: string): string {
  const sentences = text.split(/([.!?]+\s*)/)
  const actualSentences = sentences.filter((sentence) => sentence.trim().length > 0 && !sentence.match(/^[.!?\s]+$/))

  // Fisher-Yates shuffle for sentences
  for (let i = actualSentences.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[actualSentences[i], actualSentences[j]] = [actualSentences[j], actualSentences[i]]
  }

  let sentenceIndex = 0
  return sentences
    .map((segment) => {
      if (segment.trim().length > 0 && !segment.match(/^[.!?\s]+$/)) {
        return actualSentences[sentenceIndex++] || segment
      }
      return segment
    })
    .join("")
}

function scrambleLinks(html: string): string {
  const $ = cheerio.load(html)
  const links: string[] = []

  // Extract all href attributes
  $("a[href]").each((_, element) => {
    const href = $(element).attr("href")
    if (href && href.startsWith("http")) {
      links.push(href)
    }
  })

  // Shuffle the links array
  for (let i = links.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[links[i], links[j]] = [links[j], links[i]]
  }

  // Replace links with scrambled versions
  let linkIndex = 0
  $("a[href]").each((_, element) => {
    const href = $(element).attr("href")
    if (href && href.startsWith("http") && linkIndex < links.length) {
      $(element).attr("href", links[linkIndex++])
    }
  })

  return $.html()
}

function scrambleImages(html: string): string {
  const $ = cheerio.load(html)
  const images: string[] = []

  // Extract all src attributes from img tags
  $("img[src]").each((_, element) => {
    const src = $(element).attr("src")
    const alt = $(element).attr("alt") || "Image"
    if (src && (src.startsWith("http") || src.startsWith("/"))) {
      images.push(src)
    }
  })

  // Shuffle the images array
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[images[i], images[j]] = [images[j], images[i]]
  }

  // Replace image sources with scrambled versions
  let imageIndex = 0
  $("img[src]").each((_, element) => {
    const src = $(element).attr("src")
    if (src && (src.startsWith("http") || src.startsWith("/")) && imageIndex < images.length) {
      $(element).attr("src", images[imageIndex++])
    }
  })

  return $.html()
}

function scrambleText(text: string, type: ScrambleType): string {
  switch (type) {
    case "letters":
      return scrambleLetters(text)
    case "words":
      return scrambleWords(text)
    case "sentences":
      return scrambleSentences(text)
    default:
      return text
  }
}

function extractLinksInfo(html: string): string {
  const $ = cheerio.load(html)
  const links: string[] = []

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href")
    const text = $(element).text().trim()
    if (href && href.startsWith("http")) {
      links.push(`${text || "Link"}: ${href}`)
    }
  })

  return links.length > 0 ? links.join("\n") : "No external links found"
}

function extractImagesInfo(html: string): string {
  const $ = cheerio.load(html)
  const images: string[] = []

  $("img[src]").each((_, element) => {
    const src = $(element).attr("src")
    const alt = $(element).attr("alt") || "Image"
    if (src && (src.startsWith("http") || src.startsWith("/"))) {
      images.push(`${alt}: ${src}`)
    }
  })

  return images.length > 0 ? images.join("\n") : "No images found"
}

function scrambleContent(
  html: string,
  text: string,
  type: ScrambleType,
): { originalText: string; scrambledText: string } {
  switch (type) {
    case "links":
      const scrambledLinksHtml = scrambleLinks(html)
      return {
        originalText: extractLinksInfo(html),
        scrambledText: extractLinksInfo(scrambledLinksHtml),
      }
    case "images":
      const scrambledImagesHtml = scrambleImages(html)
      return {
        originalText: extractImagesInfo(html),
        scrambledText: extractImagesInfo(scrambledImagesHtml),
      }
    default:
      return {
        originalText: text,
        scrambledText: scrambleText(text, type),
      }
  }
}

function extractTextFromHtml(html: string): string {
  const $ = cheerio.load(html)

  // Remove script and style elements
  $("script, style, noscript").remove()

  // Get text content from body, or entire document if no body
  const bodyText = $("body").length > 0 ? $("body").text() : $.text()

  // Clean up whitespace and return
  return bodyText.replace(/\s+/g, " ").trim().substring(0, 5000) // Limit text length for performance
}

function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ScrambleRequest = await request.json()
    const { url, scrambleType } = body

    // Validate input
    if (!url || !scrambleType) {
      return NextResponse.json({ error: "URL and scramble type are required" }, { status: 400 })
    }

    if (!isValidUrl(url)) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    if (!["letters", "words", "sentences", "links", "images"].includes(scrambleType)) {
      return NextResponse.json({ error: "Invalid scramble type" }, { status: 400 })
    }

    // Fetch HTML content
    console.log("[v0] Fetching content from:", url)
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; WebScrambler/1.0)",
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      console.log("[v0] Fetch failed with status:", response.status)
      return NextResponse.json(
        { error: `Failed to fetch content: ${response.status} ${response.statusText}` },
        { status: 400 },
      )
    }

    const html = await response.text()
    console.log("[v0] HTML content length:", html.length)

    // Extract text content
    const originalText = extractTextFromHtml(html)
    console.log("[v0] Extracted text length:", originalText.length)

    const { originalText: processedOriginal, scrambledText } = scrambleContent(html, originalText, scrambleType)

    if (!processedOriginal.trim()) {
      return NextResponse.json({ error: "No content found for the selected scrambling method" }, { status: 400 })
    }

    console.log("[v0] Content scrambled using method:", scrambleType)

    return NextResponse.json({
      originalText: processedOriginal,
      scrambledText,
      url,
      scrambleType,
    })
  } catch (error) {
    console.error("[v0] API error:", error)

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return NextResponse.json({ error: "Request timeout - the website took too long to respond" }, { status: 408 })
      }

      return NextResponse.json({ error: `Failed to process request: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
