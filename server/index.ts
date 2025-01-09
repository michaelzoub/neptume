import { sendInitMsg } from "./services/openai"
import { type } from "./utils/typeof"
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
                //calling ai
                const body = await req.json()
                console.log("Body: ", body)
                const response = await sendInitMsg(body.message)
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
            return new Response()
        } else {
            return new Response()
        }
    }
})