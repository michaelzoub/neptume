import { SignJWT, jwtVerify } from "jose";
import { checkUserSubscription } from "./checkUserSubscription";

class ReturnData {
    public boo: boolean;
    public token: string;
  
    constructor(boo: boolean, token: string) {
      this.boo = boo;
      this.token = token;
    }
}

const secret = new TextEncoder().encode("");

async function createJWT(walletAddress: string) {
    //call mongodb
    //add all user information here:
    const check = await checkUserSubscription(walletAddress);
    return await new SignJWT({
        subscription: check,
        walletAddress: walletAddress,
        iat: Date.now(),
        iss: "Neptume"
    })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .sign(secret);
}

async function verifyJWT(token: string) {
    //returns payload, use iat to verify if time is okay, otherwise create new JWT which lasts 24h
    return (await jwtVerify(token, secret)).payload;
}

export async function generateJWT(jwtToken: string, walletAddress: string) {
    const verification = await verifyJWT(jwtToken);
    const currentTime = Date.now();
    const expiryTime = verification.iat;
    if (currentTime > (expiryTime || 0)) {
        const newJWT = await createJWT(walletAddress);
        return new ReturnData(false, newJWT);
    } else {
        return new ReturnData(true, jwtToken); 
    }
}