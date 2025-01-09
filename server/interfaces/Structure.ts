export interface response {
    type: string,
    result: boolean,
    message: string,
    parties: parties
}

interface parties {
    swap: boolean,
    from: Array<string>,
    to: Array<string>,
    amount: number
}