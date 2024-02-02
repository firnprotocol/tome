import { useAccount } from "wagmi";

import TOME_ICON from "assets/tome.svg";
import QUESTION_ICON from "assets/icons/question.svg";
import { NetworkDropdownMenu } from "@components/navbar/NetworkDropdownMenu";
import { CHAIN_PARAMS } from "@constants/networks";
import { ButtonLoadingSpinner } from "@components/loading/ButtonLoadingSpinner";
import { WalletDropdownMenu } from "@components/navbar/WalletDropdownMenu";
import { useState } from "react";


export function NavBar({ locked, setLocked }) {
  const { chain } = useAccount();

  const [switching, setSwitching] = useState(false);

  return (
    <div className="flex justify-between items-center py-1 md:justify-start md:space-x-2">
      <div className="flex justify-start flex-1">
        <span className="text-[#fc9e00] font-telegrama text-xl ml-4">
          <span className="hidden md:inline">
            Welcome to
          </span> {" "}
          TOME
        </span>
      </div>
      <div className="pl-2 pr-5 pt-2.5 pb-1">
        <NetworkDropdownMenu {...{ locked, setLocked, setSwitching }}>
          {switching ?
            <ButtonLoadingSpinner className="h-7 w-7 -mt-2.5"/> :
            <img
              src={chain === undefined ? QUESTION_ICON : CHAIN_PARAMS[chain.name].image}
              className="h-7 w-7"
            />
          }
        </NetworkDropdownMenu>
      </div>
      <WalletDropdownMenu {...{ locked, setLocked, switching, setSwitching }} />
      <div className="pl-3 pr-5 py-3">
        <img src={TOME_ICON} className="h-7 w-7"/>
      </div>
    </div>
  );
}
