import { Query } from "../interfaces/Query"

export async function POST(data: Query) {
    const response = await fetch("http://localhost:3000/database", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    const body = await response.json()
    console.log("Response from backend: ", body)
}
