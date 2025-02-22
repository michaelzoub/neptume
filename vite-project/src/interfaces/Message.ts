export interface To {
    from: string,
    to: string
}

export interface Message {
    id: number,
    message: string,
    sender: string,
    timestamp: string,
    neededInfo: {
        chaindId: number,
        to: string | To,
        abi: any,
        wei: number
    },
    jwt: string
}