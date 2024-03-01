import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";
import stripeInit from "stripe";

//stripe API
const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { user } = await getSession(req, res);

  // Create a PaymentIntent with the order amount
  const lineItems = [
    {
      price: process.env.STRIPE_PRODUCT_PRICE_ID,
      quantity: 1,
    },
  ];

  //assigning protocol depends if we on local host or on the server
  const protocol =
    process.env.NODE_ENV === "development" ? "http://" : "https://";
  const host = req.headers.host;

  // Create a new Checkout Session using the builder pattern
  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: `${protocol}${host}/success`,
    // payment_intent_data: {
    //   metadata: {
    //     sub: user.sub,
    //   },
    // },
    // metadata: {
    //   sub: user.sub,
    // },
  });

  console.log("user: ", user);

  const client = await clientPromise;
  const db = client.db("BlogAiStudio");

  // with the getSession function, you can retrieve the user's session from the request object. If the user is not authenticated, the user object is null.
  const userProfile = await db.collection("users").updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: 10,
      },
      $setOnInsert: {
        auth0Id: user.sub,
      },
    },
    {
      upsert: true,
    }
  );

  res.status(200).json({ session: checkoutSession });
}
