import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";
//to displaythe last 5 posts for the authenticated user

//proyect our API route from unauthorized access
export default withApiAuthRequired(async function handler(req, res) {
  try {
    const {
      user: { sub },
    } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db("BlogAiStudio");
    const userProfile = await db.collection("users").findOne({
      auth0Id: sub,
    });

    const { lastPostDate, getNewerPosts } = req.body;

    const posts = await db
      .collection("posts")
      .find({
        userId: userProfile._id,
        //$gt and $lt operators are used to specify conditions for greater than and less than comparisons in MongoDB
        created: { [getNewerPosts ? "$gt" : "$lt"]: new Date(lastPostDate) },
      })
      .limit(getNewerPosts ? 0 : 5)
      .sort({ created: -1 })
      .toArray();

    res.status(200).json({ posts });
    return;
  } catch (e) {}
});
