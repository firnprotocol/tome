import { Popover } from "@headlessui/react";

import toast from "react-hot-toast";
import { useAccount, useConnect, useNetwork } from "wagmi";

import { WALLETS } from "constants/wallets";
import QUESTION_ICON from "assets/icons/question.svg";


function getWalletStyle(name) {
  switch (name) {
    case "MetaMask":
      return "hover:!border-orange-500";
    case "Coinbase Wallet":
      return "hover:!border-blue-500";
    case "WalletConnect":
      return "hover:!border-sky-500";
    default:
      return "";
  }
}

export function getWalletHoverShadow(name) {
  switch (name) {
    case "MetaMask":
      return "shadow-orange-lg hover:!shadow-orange-2xl";
    case "Coinbase Wallet":
      return "shadow-blue-lg hover:!shadow-blue-2xl";
    case "WalletConnect":
      return "shadow-sky-lg hover:!shadow-sky-2xl";
    default:
      return "";
  }
}

export function WalletDropdownMenu({ locked, switching, setSwitching }) {
  const { address, connector } = useAccount(); // undef?
  const { chain } = useNetwork();
  const { connect, connectors } = useConnect({ // isLoading
    onMutate(args) {
      setSwitching(true);
    },
    onSettled(data, error) {
      setSwitching(false);
    },
    onError(error) {
      console.error(error);
      if (error.code === 4001 || error.message === "Connection request reset. Please try again.") // latter for: close walletconnect prompt
        toast.error("You rejected the wallet connection request.");
      else if (error.message === "Connector not found")
        toast.error("Wallet extension not detected!");
      else if (error.message === "Connector already connected")
        toast("You're already connected to this wallet.");
      else if (error.code === -32000) // happens when you activate walletconnect with an unknown chain!
        toast.error("You must manually add this network, in your wallet's settings, before you can switch to it.");
      else
        toast.error("An unknown error occurred.");
    },
  });

  return (
    <Popover className="relative">
      <Popover.Button
        disabled={locked || switching}
        className={`
          text-white font-telegrama
          rounded-md
          transition-all duration-75
          focus:!outline-none active:!outline-none ring-none
          group
          dark:disabled:text-zinc-500
          bg-transparent active:bg-zinc-500 disabled:bg-zinc-700
          border border-gray-200 hover:border-gray-500 active:border-blue-500
          text-gray-600 hover:text-gray-800
          active:bg-gray-800
          border-gray-700 hover:border-sky-500
          text-zinc-400 hover:text-zinc-300
          w-full cursor-pointer rounded-lg
          py-0.5 pl-2.5 pr-0.5 group
          focus:outline-none focus:ring-0
          hover:bg-zinc-900
          disabled:!bg-zinc-900
          ${getWalletStyle(connector?.name)}
          ${getWalletHoverShadow(connector?.name)}
          shadow-indigo-sm flex-shrink rounded-md
          text-sm
        `}
      >
        <div className="space-x-2 -mt-1">
          <div
            className={`
              inline-block rounded-md
              text-gray-400 group-hover:text-gray-300
              px-0.5 py-2 group-hover:bg-opacity-10 bg-gray-900 tracking-wide font-light
              bg-opacity-20 font-telegrama align-middle
            `}
          >
            {address ?
              <div className="w-full">
                <div>
                  {address.substring(0, 6)}...{address.substring(address.length - 4, address.length)}
                </div>
              </div> : "NOT CONNECTED"
            }
          </div>
          <div className="inline-block rounded-md pt-2 pr-2">
            {connector ?
              <img
                src={WALLETS[connector.name].image}
                className="inline-block w-4 h-4 text-white opacity-80 group-hover:opacity-100"
              /> :
              <img
                src={QUESTION_ICON}
                className="inline-block w-4 h-4 text-white opacity-50 group-hover:opacity-100"
              />
            }
          </div>
        </div>
      </Popover.Button>
      <Popover.Panel className="bg-zinc-800 rounded-lg absolute z-10 w-[210px] left-[-50px]">
        <div className="pt-1 px-3 pb-2 w-full bg-zinc-900 font-telegrama rounded-t-lg">
          <small className="text-slate-500">CURRENT WALLET</small>
          <div className="text-cyan-600 flex justify-between items-center py-1 md:justify-start md:space-x-2">
            <div className="flex justify-start flex-1">
              {address === undefined ?
                "NOT CONNECTED" :
                `${address.slice(0, 6)}...${address.slice(-4)}`
              }
            </div>
            {address && connector && <img
              src={WALLETS[connector.name].image}
              className="h-5 w-5"
            />
            }
          </div>
        </div>
        {connectors.map((connector, index) => // shadows
          <div className="p-1" key={index}>
            <Popover.Button
              className="text-left p-2 w-full text-slate-400 hover:text-slate-300 hover:bg-zinc-900 font-telegrama text-sm rounded"
              onClick={() => {
                connect({ connector, chainId: chain?.id }); // can be undef when not connected
              }}
            >
              <div className="flex justify-between items-center py-1 md:justify-start md:space-x-2">
                <div className="flex justify-start flex-1">{connector.name}</div>
                <img
                  src={WALLETS[connector.name].image}
                  className="h-5 w-5"
                />
              </div>
            </Popover.Button>
          </div>
        )}
      </Popover.Panel>
    </Popover>
  );
}
