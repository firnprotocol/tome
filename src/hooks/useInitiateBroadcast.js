import toast from "react-hot-toast";
import { useAccount, useConfig } from "wagmi";
import { getPublicClient } from "wagmi/actions";

import { ExplorerLink } from "components/ExplorerLink";
import { ADDRESSES } from "constants/addresses";


const defaultSnapOrigin = "npm:@firnprotocol/snap"

export function useInitiateBroadcast() {
  const config = useConfig();
  const { chain } = useAccount();

  async function initiateBroadcast({ setDisplay, setLocked, data, tip }) {
    setLocked(true);

    try {
      const publicClient = await getPublicClient(config);
      const clientVersion = await publicClient.request({
        method: "web3_clientVersion",
      });
      const isFlaskDetected = clientVersion.includes("flask");
      if (!isFlaskDetected) {
        throw { message: "No Flask" };
      }

      const snaps = await window.ethereum.request({
        method: "wallet_getSnaps",
      });
      const snapPresent = Object.values(snaps).find((snap) => snap.id === defaultSnapOrigin);
      if (!snapPresent)
        await publicClient.request({
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
      if (error.message === "User rejected the request.") // ??????
        toast.error("You declined the prompt.");
      else if (error.message === "No Flask")
        toast.error(<span>
          Tome currently only works with <span className="underline"><a href="https://metamask.io/flask/"
                                                                        target="_blank">MetaMask <span
          className="italic">Flask</span></a></span>! Standard MetaMask support is coming soon.
        </span>);
      else if (error.message === "Insufficient balance for transaction.")
        toast.error(
          <span>Your Firn balance is insufficient to cover the gas fee of {(tip / 1000).toFixed(3)} ETH.
            Please top up your Firn balance by depositing
            at <a href="https://firn.cash" target="_blank"><span className="underline">firn.cash</span></a>.
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
