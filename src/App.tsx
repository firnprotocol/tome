import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { http, webSocket } from "viem";
import { useAccount, createConfig, fallback, unstable_connector, WagmiProvider } from "wagmi";
import { CustomToaster } from "@components/toasts/CustomToaster";
import { base } from "viem/chains";
import { injected, walletConnect } from "wagmi/connectors";

import { Grid } from "@tw/Grid";
import { StandardPageContainer } from "@components/StandardPageContainer";
import { PageFooter } from "@layouts/PageFooter";
import { NavBar } from "@components/navbar";
import { MainPanel } from "@ui/MainPanel";


export function Main() {
  const { address, chain } = useAccount();

  const [locked, setLocked] = useState(false);

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
        {...{ locked, setLocked }}
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

const queryClient = new QueryClient();

const config = createConfig({
  chains: [base],
  pollingInterval: 15_000,
  connectors: [
    walletConnect({ projectId: "7e98ab877dc43e11739016143ae3416e" })
  ],
  transports: {
    [base.id]: fallback([
      webSocket("wss://base-mainnet.g.alchemy.com/v2/KsgLWxVs5GgMkAdrgjxL9R2x-eMamu26"),
      http("http://base-mainnet.g.alchemy.com/v2/KsgLWxVs5GgMkAdrgjxL9R2x-eMamu26"),
      http("https://1rpc.io/4qUmg7L19yZ9fxzGv/base"),
      http(),
      unstable_connector(injected),
    ]),
  },
});


function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CustomToaster/>
        <Main/>
      </QueryClientProvider>
    </WagmiProvider>
  );
}


export default App;