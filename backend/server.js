import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import issuesRoute from "./routes/issue.routes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import commentRoutes from "./routes/comments.routes.js";
import mongoose from "mongoose";

const app = express();
app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/issues', issuesRoute);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test';

async function main() {
  await mongoose.connect(MONGO_URL);
}

main().then(() => {
  console.log("MongoDB connected successfully!");
}).catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("hello")
})

// In your backend endpoint
app.post('/api/extract-issue', async (req, res) => {
  try {
    const { transcript } = req.body;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: `Extract issue information from this text and return ONLY valid JSON with no markdown:
{
  "title": "brief title (max 60 chars)",
  "description": "description",
  "priority": "Low, Medium, or High",
  "status": "Backlog, Todo, In Progress, or Done"
}

Text: "${transcript}"`
            }
          ],
          temperature: 0.3,
          max_tokens: 300
        })
      }
    );

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      res.json(parsed);
    } else {
      throw new Error('Could not parse response');
    }

  } catch (error) {
    console.error('Extract issue error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log("Server is up and running!", PORT);
})