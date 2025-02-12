import { Query } from "../interfaces/Query"
import { apiEndpoint } from "../data/apiEndpoint"

export async function POST(data: Query) {
    const response = await fetch(`${apiEndpoint}/database`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    const body = await response.json()
    console.log("Response from backend: ", body)
}
