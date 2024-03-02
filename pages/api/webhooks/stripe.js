import Cors from "micro-cors";
import stripeInit from "stripe";
import verifyStripe from "@webdeveducation/next-verify-stripe";
import clientPromise from "../../../lib/mongodb";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

// configuration object that's being exported for use elsewhere in the application to configure the API route
//This code snippet disables the default body parser for the specific API route, useful when you want to stream or handle incoming data in a custom way.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Don't forget to add the STRIPE_WEBHOOK_SECRET to your .env file
const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handler = async (req, res) => {
  if (req.method === "POST") {
    let event;
    try {
      event = await verifyStripe({
        req,
        stripe,
        endpointSecret,
      });
    } catch (e) {
      console.log("ERROR: ", e);
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const client = await clientPromise;
        const db = client.db("BlogAiStudio");

        const paymentIntent = event.data.object;
        const auth0Id = paymentIntent.metadata.sub;

        console.log("AUTH 0 ID: ", paymentIntent);

        // with the getSession function, you can retrieve the user's session from the request object. If the user is not authenticated, the user object is null.
        const userProfile = await db.collection("users").updateOne(
          {
            auth0Id,
          },
          {
            $inc: {
              availableTokens: 10,
            },
            $setOnInsert: {
              auth0Id,
            },
          },
          {
            upsert: true,
          }
        );
      }
      default:
        console.log("UNHANDLED EVENT: ", event.type);
    }
    res.status(200).json({ received: true });
  }
};

export default cors(handler);
