import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json()

    if (!title || !description) {
      return Response.json({ error: "Title and description are required" }, { status: 400 })
    }

    const categories = ["Technical Issue", "Billing", "Account", "Feature Request", "General Inquiry"]
    const priorities = ["low", "medium", "high"]

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Analyze this support issue and categorize it.

Issue Title: ${title}
Issue Description: ${description}

Available categories: ${categories.join(", ")}
Available priorities: ${priorities.join(", ")}

Respond in JSON format with exactly this structure:
{
  "category": "one of the available categories",
  "priority": "one of the available priorities",
  "reasoning": "brief explanation of why"
}

Only respond with valid JSON, no additional text.`,
    })

    const result = JSON.parse(text)

    // Validate the response
    if (!categories.includes(result.category)) {
      result.category = "General Inquiry"
    }
    if (!priorities.includes(result.priority)) {
      result.priority = "medium"
    }

    return Response.json(result)
  } catch (error) {
    console.error("Categorization error:", error)
    return Response.json(
      { error: "Failed to categorize issue", category: "General Inquiry", priority: "medium" },
      { status: 500 },
    )
  }
}
