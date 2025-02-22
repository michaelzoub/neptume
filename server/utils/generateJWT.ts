import { SignJWT, jwtVerify } from "jose";
import { checkUserSubscription } from "./checkUserSubscription";
import { createNewAccountDB } from "./createNewAccountDB";
import { config } from "dotenv";
config();
const { JWT_SECRET } = process.env;

class ReturnData {
    public boo: boolean;
    public token: string;
  
    constructor(boo: boolean, token: string) {
      this.boo = boo;
      this.token = token;
    }
}

interface returnObject {
    boo: boolean,
    jwt: string
}

const secret = new TextEncoder().encode(JWT_SECRET);

async function createJWT(walletAddress: string, check: boolean) {
    //call mongodb
    //add all user information here:
    return await new SignJWT({
        subscription: check,
        walletAddress: walletAddress,
        iat: Math.floor(Date.now() / 1000),
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

export async function generateJWT(jwtToken: string, walletAddress: string): Promise<returnObject> {
    //first check wether or not theres a jwt passed
    if (jwtToken == "") {
        //create store in db
        await createNewAccountDB(walletAddress);
        const newJWT = await createJWT(walletAddress, false);
        console.log("Created jwt: " + newJWT);
        return {
            boo: false,
            jwt: newJWT
        };
    }
    const check = await checkUserSubscription(walletAddress);
    const verification = await verifyJWT(jwtToken);
    const currentTime = Date.now();
    const expiryTime = verification.iat;
    if (currentTime > (expiryTime || 0)) {
        const newJWT = await createJWT(walletAddress, check);
        return {
            boo: false,
            jwt: newJWT
        };
    } else {
        return {
            boo: true,
            jwt: jwtToken
        };
    }
}