export function extractTxHash(message: string) {
    const txHashRegex = /\b0x[a-fA-F0-9]{64}\b/

    const match = message.match(txHashRegex);

    return match ? match[0] : "";
}