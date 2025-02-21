import { sendInitMsg } from "./services/openai"
import { type } from "./utils/typeof"
import { checkDB } from "./utils/db"
import Stripe from 'stripe';
import { checkNumTries } from "./utils/checkNumTries";
import { checkUserSubscription } from "./utils/checkUserSubscription";
import { generateJWT } from "./utils/generateJWT";

const stripe = new Stripe('sk_test_51Q2bQIGE5A9UAgyNRvt03I7eQuOjJET8FJITwA4nssMw5iLr5JpqcmIStZpiocq0im4wuc3yHfIQASjHheuko3xS005exparsA', {
});

console.log("Hello via Bun!")

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",  // In production, specify exact origin
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
}

//localhost:8080
Bun.serve({
    port: 8080,
    fetch(req: Request): Response | Promise<Response> {

        if (req.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(req.url)
        if (url.pathname == "/openai") {
            console.log("AI hit.")
            //first check if user has access (in database)
            async function ai() {
                const body = await req.json()
                console.log("Body: ", body)
                //check if user has subscription, store cache for 24 hours

                //const subscription = await checkUserSubscription(body.address)
                const subscription = await generateJWT(body.jwt, body.address);
                
                if (!subscription) {
                    const checkDB = await checkNumTries(body.address)
                    if (!checkDB) {
                        const returnObject = {
                            type: "error",
                            result: false,
                            message: "No more tries. Consider subscribing to Neptume for unlimited usage!",
                            parties: ""
                        }
                        return new Response(JSON.stringify(returnObject), {
                            headers: corsHeaders
                        })
                    }
                }
                const response = await sendInitMsg(body.message, body.contextInfo)
                console.log("Initial message received from AI: ", response)
                //turn into data object depending on response
                const object = await type(response, body.address, body.message, body.chainId)
                console.log("Data object ready to be sent to frontend: ", object)
                return new Response(JSON.stringify(object), {
                    headers: corsHeaders
                })
            }
            return ai()
        } if (url.pathname == "/database") {
            async function database() {
                const body = await req.json()
                //return true or false
                return new Response(JSON.stringify(false), {
                    headers: corsHeaders
                })
            }
            return database()
        } if (url.pathname === "/create-payment-intent") {
            async function subscription() {
                console.log("Hit create payment intent")
                const { items } = await req.json();
      
                // Create a PaymentIntent with the order amount and currency
                const paymentIntent = await stripe.paymentIntents.create({
                  amount: 1000,
                  currency: "usd",
                  automatic_payment_methods: {
                    enabled: true,
                  },
                });
          
                return new Response(JSON.stringify({
                  clientSecret: paymentIntent.client_secret,
                }), {
                    headers: corsHeaders
                });
            }
            return subscription()
          } else {
            return new Response()
        }
    }
})