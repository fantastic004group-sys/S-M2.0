import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Groq API Recommendation Endpoint
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { cartItems, history } = req.body;
      
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert fashion consultant for a Bengali Boutique. Recommend 3-5 product types or styles based on the user's cart and history. Return JSON only.",
          },
          {
            role: "user",
            content: `Cart: ${JSON.stringify(cartItems)}. History: ${JSON.stringify(history)}`,
          },
        ],
        model: "mixtral-8x7b-32768",
        response_format: { type: "json_object" },
      });

      res.json(JSON.parse(completion.choices[0]?.message?.content || "{}"));
    } catch (error: any) {
      console.error("Groq Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
