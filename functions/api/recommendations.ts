interface Env {
  GROQ_API_KEY: string;
}

interface GroqCompletion {
  choices?: Array<{ message?: { content?: string } }>;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  try {
    const { cartItems, history } = await request.json() as { cartItems: string[]; history: string[] };

    if (!env.GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: "GROQ_API_KEY is not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are an expert fashion consultant for a Bengali Boutique. Recommend 3-5 product types or styles based on the user's cart and history. Return JSON only with a 'recommendations' array of objects with 'style' and 'reason' fields.",
          },
          {
            role: "user",
            content: `Cart: ${JSON.stringify(cartItems)}. History: ${JSON.stringify(history)}`,
          },
        ],
        model: "mixtral-8x7b-32768",
        response_format: { type: "json_object" },
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error("Groq API error:", errorText);
      return new Response(JSON.stringify({ error: "Failed to get recommendations" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const completion = (await groqResponse.json()) as GroqCompletion;
    const content = completion.choices?.[0]?.message?.content || "{}";

    return new Response(content, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Recommendation error:", error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
