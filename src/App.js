import { useEffect, useState } from "react";
import { watchAccount, watchNetwork } from "wagmi/actions";

import { Grid } from "tw/Grid";

import { StandardPageContainer } from "components/StandardPageContainer";
import { PageFooter } from "layouts/PageFooter";
import { NavBar } from "components/navbar";
import { MainPanel } from "ui/MainPanel";
import toast from "react-hot-toast";


export function App() {
  const [locked, setLocked] = useState(false);
  const [switching, setSwitching] = useState(false);

  // really the below two useEffects can (apparently) go essentially anywhere.
  useEffect(() => {
    const unwatch = watchNetwork(({ chain }) => {
      if (chain === undefined) toast.error("Your wallet has been disconnected.");
      else if (chain.unsupported) toast.error("Switched to an unsupported chain.");
      else
        toast(
          <span>
            Switched the chain to <b>{chain.name}</b>.
          </span>
        );
    });
    return () => { unwatch(); };
  }, []);

  useEffect(() => {
    const unwatch = watchAccount(({ address }) => {
      if (address)
        toast(
          <span>
            Switched account to <code>{address.slice(0, 6)}...{address.slice(-4)}</code>.
          </span>
        );
    });
    return () => { unwatch(); };
  }, []);

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


