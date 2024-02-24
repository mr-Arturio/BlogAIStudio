import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(config);

  const topic = "coin collecting";
  const keywords = "USA silver coins, half dollar, commemorative";

  const response = await openai.createChatCompletion({
    model: "gpt-4-1106-preview",
    messages: [
      {
        role: "system",
        content:
          "You are an SEO friendly blog post generator called BlogAiStudio. You are designed to output markdown without frontmatter.",
      },
      {
        role: "user",
        content: `Generates me long and detailed SEO friendly blog post on the following topic delimited by triple hyphens:
        ---
        ${topic}
        ---
        Targeting the following comma-separated keywords delimited by triple hyphens:
        ---
        ${keywords}
        ---
        `,
      },
    ],
    temperature: 0,
  });

  console.log(response.data.choices[0]?.message?.content);

  res
    .status(200)
    .json({ postContent: response.data.choices[0]?.message?.content });
}
