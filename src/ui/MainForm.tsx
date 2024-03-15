import { useState } from "react";

import { Card } from "@tw/Card";

import { SubmitTxButton } from "@components/SubmitTxButton";
import { MessageField } from "@components/MessageField";
import { useAccount } from "wagmi";
import { optimismTxCompressedSize } from "utils/gas";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useInitiateBroadcast } from "hooks/useInitiateBroadcast";
import { encodeFunctionData, formatUnits } from "viem";
import { TOME_ABI } from "constants/abis";


const BTN_ICON_CLASSNAME = "inline w-5 h-5 -mt-1";
export const WITHDRAWAL_GAS = 3850000n;
const WITHDRAWAL_TX_COMPRESSED_SIZE = 2900n;

export function MainForm({ locked, setLocked, calculators }) {
  const { address, chain } = useAccount();

  const [display, setDisplay] = useState("");

  const initiateBroadcast = useInitiateBroadcast();

  const data = encodeFunctionData({
    abi: TOME_ABI,
    functionName: "broadcast",
    args: [display],
  });

  let gas = 0n;
  if (chain?.name === "Base") {
    const l2Gas = WITHDRAWAL_GAS;
    const txCompressedSize = WITHDRAWAL_TX_COMPRESSED_SIZE + optimismTxCompressedSize(data);
    gas = calculators["Base"](l2Gas, txCompressedSize);
  }

  let helper = "";
  if (chain === undefined)
    helper = "Please connect your wallet to a supported network.";
  // will need an error case for non-flask.
  else if (display === "")
    helper = "Please enter a nonempty message.";

  const tip = Math.ceil(parseFloat(formatUnits(gas, 15)));
  const message = `Your broadcast will cost ${(tip / 1000).toFixed(3)} ETH in gas.`;
  return (
    <Card title="ANONYMOUSLY BROADCAST A MESSAGE">
      <div className="text-sm text-yellow-700 pb-2">
        The message you enter and broadcast below will be public, and visible permanently on the blockchain.
        Only <span className="italic">your identity</span> will be hidden; your message will not be. This action cannot be undone.
      </div>
      <div className="font-telegrama text-sm text-stone-700 pb-1">
        MESSAGE
      </div>
      <MessageField
        error={helper.length > 0}
        helper={helper}
        display={display}
        setDisplay={setDisplay}
        locked={locked}
        label="Your Message"
      />
      <div className="pb-2 text-sm text-stone-700">
        {message}
      </div>
      <SubmitTxButton
        disabled={
          !address
          || locked
          || helper.length > 0
          || display === ""
        }
        pendingLabel="BROADCASTING ANONYMOUSLY"
        label={<>BROADCAST ANONYMOUSLY <PaperAirplaneIcon className={BTN_ICON_CLASSNAME}/></>}
        onClick={() => {
          return initiateBroadcast({
            setDisplay,
            setLocked,
            data,
            tip,
          });
        }}
      />
    </Card>
  );
}
