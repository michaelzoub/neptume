import { Message } from "../interfaces/Message"
import { Query } from "../interfaces/Query"
import { sendTransaction } from "../utils/sendTransaction"

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

    const randomInteger = Math.floor(Math.random() * 300)
    const timeSplit = new Date().toLocaleTimeString().split(":")[0] + ":" + new Date().toLocaleTimeString().split(":")[1]
    try {
        const response = await fetch("http://localhost:8080/openai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        const body = await response.json()
        console.log("Response from backend: ", body)
        let object
        if (body.type == "chain") {
            object = {
                id: randomInteger,
                sender: "assistant",
                message: "Please switch your network to a supported chain.",
                timestamp: timeSplit,
                neededInfo: {
                    chaindId: 1,
                    to: "",
                    abi: "",
                    wei: 0
                }
            }
        } else if (body.type == "sendTransaction") {
            console.log("Send Transaction type")
            //set up return object for message and then connect privy's send transaction function for logic
            const sendTxObject = body.message
            const parties = body.parties
            object = {
                id: randomInteger,
                sender: "assistant",
                message: "Sending transaction...",
                timestamp: timeSplit,
                neededInfo: {
                    chaindId: sendTxObject.chainId,
                    to: parties.to[0],
                    abi: sendTxObject.abi,
                    wei: sendTxObject.wei
                }
            }
            //sends tx
            //await sendTransaction(sendTxObject.chainId, parties.to[0], sendTxObject.abi, sendTxObject.wei)
        } else if (body.type == "swap") {

            object = {
                id: randomInteger,
                sender: "assistant",
                message: body.message,
                timestamp: timeSplit,
                neededInfo: {
                    chaindId: 1,
                    to: {
                        from: body.parties.from,
                        to: body.parties.to
                    },
                    abi: body.parties.abi,
                    wei: 0
                }
            }
        } else {
            object = {
                id: randomInteger,
                sender: "assistant",
                message: body.message,
                timestamp: timeSplit,
                neededInfo: {
                    chaindId: 1,
                    to: "",
                    abi: "",
                    wei: 0
                }
            }
        }
        return object
    } catch (error) {
        console.error(error)
        return {
            id: randomInteger,
            sender: "assistant",
            message: "No message received",
            timestamp: timeSplit,
            neededInfo: {
                chaindId: 1,
                to: "",
                abi: "",
                wei: 0
            }
        }
    }
}


