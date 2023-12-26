import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { Grid } from "tw/Grid";

import { StandardPageContainer } from "components/StandardPageContainer";
import { PageFooter } from "layouts/PageFooter";
import { NavBar } from "components/navbar";
import { MainPanel } from "ui/MainPanel";
import toast from "react-hot-toast";


export function App() {
  const { address, chain } = useAccount();

  const [locked, setLocked] = useState(false);
  const [switching, setSwitching] = useState(false);

  // really the below two useEffects can (apparently) go essentially anywhere.
  useEffect(() => { // watchChainId
    if (chain === undefined) toast.error("Switched to an unsupported chain."); // Your wallet has been disconnected.
    else
      toast(
        <span>
            Switched the chain to <b>{chain.name}</b>.
          </span>
      );
  }, [chain]);

  useEffect(() => { // watchAccount
    if (address)
      toast(
        <span>
          Switched account to <code>{address.slice(0, 6)}...{address.slice(-4)}</code>.
        </span>
      );
  }, [address]);

  return (
    <div className="text-slate-400 bg-stone-800 min-h-screen overflow-hidden">
      <NavBar
        {...{ locked, switching, setSwitching }}
      />
      <StandardPageContainer>
        <Grid
          cols={{ xs: 1 }}
          className="justify-center place-content-center place-items-center"
        >
          <div className="max-w-[46.3rem] w-full">
            <MainPanel
              {...{ locked, setLocked }}
            />
          </div>
        </Grid>
      </StandardPageContainer>
      <PageFooter/>
    </div>
  );
}


