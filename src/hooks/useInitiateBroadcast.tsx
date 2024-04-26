import toast from "react-hot-toast";
import { useAccount, useConfig } from "wagmi";
import { getPublicClient } from "wagmi/actions";

import { ExplorerLink } from "components/ExplorerLink";
import { ADDRESSES } from "constants/addresses";


const defaultSnapOrigin = "npm:@firnprotocol/snap"; // "local:http://localhost:8080"

export function useInitiateBroadcast() {
  const { chain } = useAccount();

  async function initiateBroadcast({ setDisplay, setLocked, data, tip }) {
    setLocked(true);

    try {
      // if (connector.name !== "MetaMask") throw { message: "Not MetaMask" };
      const snaps = await window.ethereum.request({
        method: "wallet_getSnaps",
      });
      const snapPresent = Object.values(snaps).find((snap) => snap.id === defaultSnapOrigin);
      if (!snapPresent)
        await window.ethereum.request({
          method: "wallet_requestSnaps",
          params: { [defaultSnapOrigin]: {} },
        });

      await window.ethereum.request({
        method: "wallet_invokeSnap",
        params: { snapId: defaultSnapOrigin, request: { method: "initialize" } }
      });

      const transaction = {
        to: ADDRESSES[chain.name].TOME,
        data,
        value: 0,
      };
      // actually invoke snap
      const transactionHash = await window.ethereum.request({
        method: "wallet_invokeSnap",
        params: { snapId: defaultSnapOrigin, request: { method: "transact", params: transaction } },
      });

      toast.success(
        <span>
          Your broadcast was successful!
          You can see your transaction at <ExplorerLink hash={transactionHash}/>.
        </span>
      );
    } catch (error) {
      // todo: what happens when they decline the prompt?
      console.error(error);
      if (error.details === "User rejected the request.") // ??????
        toast.error("You declined the prompt.");
      else if (
        error.message === "Not MetaMask"
        || error.message === "The method \"wallet_getSnaps\" does not exist / is not available."
        // || error.message === "Request method wallet_getSnaps is not supported"
      )
        toast.error(<span>
          Right now, Tome works only on desktop <span className="underline"><a href="https://metamask.io/flask/"
                                                                               target="_blank">MetaMask Flask</a></span>.
        </span>);
      else if (error.message === "Insufficient balance for transaction.")
        toast.error(
          <span>Your Firn balance is insufficient to cover the gas fee of {(tip / 1000).toFixed(3)} ETH.
            Please top up your Firn balance by depositing
            at <a href="https://firn.io" target="_blank"><span className="underline">firn.io</span></a>.
          </span>
        );
      else
        toast.error("An unknown error occurred.");
    } finally {
      setLocked(false);
      setDisplay("");
    }
  }

  return initiateBroadcast;
}
