export interface Query {
    message: string,
    address: string,
    time: string,
    chainId: number,
    contextInfo: unknown,
    jwt: string
}