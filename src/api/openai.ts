import { Query } from "../interfaces/Query"

export async function GET() {
   const response = await fetch("machinai.com/api/fdsf", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
   })
   const data = await response.json()
   return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
        "Content-Type": "application/json",
    },
   })
}

//data string for now, make data structure for later (i guess the only data we need is user's address + their question)
export async function POST(data: Query) {
    const response = await fetch("http://localhost:3000/openai", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    const body = await response.json()
    console.log("Response from backend: ", body)
}


