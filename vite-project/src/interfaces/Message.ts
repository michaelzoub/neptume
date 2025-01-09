export interface Message {
    id: number,
    message: string,
    sender: string,
    timestamp: string,
    neededInfo: {
        chaindId: number,
        to: string,
        abi: any,
        wei: number
    }
}