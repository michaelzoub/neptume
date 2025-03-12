import { Query } from "../interfaces/Query"
import { apiEndpoint } from "../data/apiEndpoint"

export async function GET() {
   const response = await fetch(`${apiEndpoint}/api`, {
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

    const timeSplit = new Date().toLocaleTimeString().split(":")[0] + ":" + new Date().toLocaleTimeString().split(":")[1];
    const randomInteger = Math.floor(Math.random() * 300);

    if (!data.address) {
        return {id: randomInteger,
        sender: "assistant",
        message: "Please connect your wallet to start using Neptume.",
        timestamp: timeSplit,
        neededInfo: {
            chaindId: 0,
            to: "",
            abi: "",
            wei: 0
        },
        jwt: ""
        }
    }

    try {
        console.log(apiEndpoint)
        const response = await fetch(`${apiEndpoint}/openai`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        const body = await response.json()
        console.log("Response from backend: ", body)
        let object
        //copy this function into utils (code cleanup)
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
                },
                jwt: data.jwt
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
                },
                jwt: sendTxObject.jwt
            }
            //sends tx
            //await sendTransaction(sendTxObject.chainId, parties.to[0], sendTxObject.abi, sendTxObject.wei)
        } else if (body.type == "swap") {
            object = {
                id: randomInteger,
                sender: "assistant",
                message: "Swapping...",
                timestamp: timeSplit,
                neededInfo: {
                    chaindId: 1,
                    to: {
                        from: body.parties.from,
                        to: body.parties.to
                    },
                    abi: body.parties.abi,
                    wei: body.parties.amount
                },
                jwt: body.jwt
            }
        } else if (body.type == "subscription") {
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
                },
                jwt: body.jwt
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
                },
                jwt: body.jwt
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
            },
            jwt: data.jwt
        }
    }
}


