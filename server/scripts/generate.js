import { secp256k1 as secp } from "ethereum-cryptography/secp256k1.js";
import { toHex } from "ethereum-cryptography/utils.js";

const privateKey = secp.utils.randomPrivateKey();
const publicKey = secp.getPublicKey(privateKey, false);

console.log(`private key: ${toHex(privateKey)}`);
console.log(`public key: ${toHex(publicKey)}`);
