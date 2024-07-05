import server from "./server";
import { secp256k1 as secp } from "ethereum-cryptography/secp256k1.js";
import { toHex } from "ethereum-cryptography/utils.js";

function Wallet({
  address,
  setSenderAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(e) {
    const privateKey = e.target.value;
    setPrivateKey(privateKey);

    try {
      const address = toHex(secp.getPublicKey(privateKey, false));
      setSenderAddress(address);
      if (address) {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    } catch (e) {
      setBalance(0);
      setSenderAddress("");
      console.log(e);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type in a private key"
          value={privateKey}
          onChange={onChange}
        />
      </label>
      <div>Address: {address.slice(0, 10)}...</div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
