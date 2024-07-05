import express from "express";
import cors from "cors";
import { secp256k1 as secp } from "ethereum-cryptography/secp256k1.js";
import { bytesToHex, utf8ToBytes } from "ethereum-cryptography/utils.js";
import { sha256 } from "ethereum-cryptography/sha256.js";

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04bceeaa8bf9c8118216cebb454a4cea6dc3ea36e2b573781d5499c93c1366cac243f983cda644cfd3bb0ff91195610279230b16e929c6ae3a859583dfabe01e70": 100,
  "04d5684de5ac996486c19a238c439f6b4e9872c6f85296c188192b9929dddd94831fe6a30b0c39e662dd95bca37dfc383912d624c2966eadb471e8e438144e4c28": 50,
  "046971180a0503089555d38d8c90ce57da618f4a1054d36c6dbbfbfe159a29412b0e3d07bd5b6772a10a15b61d6a0810c95a22c602defd68ceb5f37077b9e89707": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get a signature from client-side application
  // recover the public address from the signature

  const { recipient, amount, signature } = req.body;

  const reconstructedSignature = secp.Signature.fromCompact(
    signature.r + signature.s
  ).addRecoveryBit(signature.recovery);

  const message = recipient + amount;
  const hashMessage = sha256(utf8ToBytes(message));
  const publicKeyPoint = reconstructedSignature.recoverPublicKey(hashMessage);
  const sender = bytesToHex(publicKeyPoint.toRawBytes(false));

  const isValid = secp.verify(reconstructedSignature, hashMessage, sender);

  if (isValid) {
    setInitialBalance(sender);
    setInitialBalance(recipient);
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(500).send({ message: "Invalid Transaction!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
