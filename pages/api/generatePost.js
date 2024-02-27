import { Configuration, OpenAIApi } from "openai";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

// with the withApiAuthRequired higher-order function, you can require authentication to access the API route. If the user is not authenticated, they are redirected to the login page.
export default withApiAuthRequired(async function handler(req, res) {
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db("BlogAiStudio");
  // get user profile from the database
  const userProfile = await db.collection("users").findOne({
    auth0Id: user.sub,
  });
  // check if user exist and if the user doesn't have any available tokens, return a 403 status code
  if (!userProfile?.availableTokens) {
    res.status(403); //403 user is authorized, but doesn't have the required permissions to process this request.
    return;
  }

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(config);

  // get the topic and keywords from the request body
  const { topic, keywords } = req.body;

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

  const postContent = response.data.choices[0]?.message?.content;

  const seaResponse = await openai.createChatCompletion({
    model: "gpt-4-1106-preview",
    messages: [
      {
        role: "system",
        content:
          "You are an SEO friendly blog post generator called BlogAiStudio. You are designed to output JSON. Do not include HTML tags in your output.",
      },
      {
        role: "user",
        content: `Generates an SEO friendly title and SEO friendly meta description for the following blog post: ${postContent}
        ---
        The output Json must be in the following format:
        {
          "title": "Your title here",
          "metaDescription": "Your meta description here"
        }
        `,
      },
    ],
    response_format: { type: "json_object" },
  });

  const seoData = seaResponse.data.choices[0]?.message?.content;
  const { title, metaDescription } = JSON.parse(seoData) || {};

  //decrement the user's available tokens by 1 when used
  await db.collection("users").updateOne(
    { auth0Id: user.sub },
    {
      $inc: {
        availableTokens: -1,
      },
    }
  );

  console.log("Successfully generated title and metaDescription:", { title, metaDescription });


  // insert the post into the database
  const post = await db.collection("posts").insertOne({
    postContent,
    title,
    metaDescription,
    topic,
    keywords,
    userId: userProfile._id, //using mongodb's generated user _id
    created: new Date(),
  });

  res.status(200).json({
    post: {
      postContent,
      title,
      metaDescription,
    },
  });
});
