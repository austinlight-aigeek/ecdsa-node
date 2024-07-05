import { useState } from "react";
import server from "./server";
import { secp256k1 as secp } from "ethereum-cryptography/secp256k1.js";
import { utf8ToBytes } from "ethereum-cryptography/utils.js";
import { sha256 } from "ethereum-cryptography/sha256.js";

function Transfer({ setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (e) => setter(e.target.value);

  async function transfer(e) {
    e.preventDefault();

    const message = recipient + sendAmount;
    const hashMessage = sha256(utf8ToBytes(message));

    const signature = secp.sign(hashMessage, privateKey);

    const data = {
      recipient,
      amount: parseInt(sendAmount),
      signature: {
        ...signature,
        r: signature.r.toString(16),
        s: signature.s.toString(16),
      },
    };

    try {
      const {
        data: { balance },
      } = await server.post(`send`, data);
      setBalance(balance);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
