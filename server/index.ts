import { sendInitMsg } from "./services/openai"
import { type } from "./utils/typeof"
import { checkDB } from "./utils/db"
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
                const dbResponse = checkDB(body.address)
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
            //return true or false
            //then update user object
            return new Response(JSON.stringify(false), {
                headers: corsHeaders
            })
        } if (url.pathname == "/subscription") {

            return new Response()
        } else {
            return new Response()
        }
    }
})