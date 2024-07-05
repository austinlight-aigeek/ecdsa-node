import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [senderAddress, setSenderAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={senderAddress}
        setSenderAddress={setSenderAddress}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
      />
      <Transfer setBalance={setBalance} privateKey={privateKey} />
    </div>
  );
}

export default App;
