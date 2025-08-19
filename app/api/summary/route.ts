import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Text content is required" }, { status: 400 })
    }

    // Limit text length for API efficiency
    const truncatedText = text.substring(0, 3000)

    const { text: summary } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `Analyze and summarize the following website content. Provide a concise summary that captures the main topics, key information, and overall purpose of the content. Keep it under 150 words and focus on the most important points.

Content to analyze:
${truncatedText}`,
      maxTokens: 200,
    })

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("[v0] AI Summary error:", error)
    return NextResponse.json({ error: "Failed to generate AI summary" }, { status: 500 })
  }
}
