import "./index.css";
import "./assets/telegrama.woff2";

import { createRoot } from "react-dom/client";

import { http } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, fallback, unstable_connector, WagmiProvider } from "wagmi";
import { base } from "viem/chains";
import { injected, metaMask } from "wagmi/connectors";

import { CustomToaster } from "components/toasts/CustomToaster";

import { App } from "./App";


const queryClient = new QueryClient();

const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: fallback([
      unstable_connector(injected),
      http("https://1rpc.io/4qUmg7L19yZ9fxzGv/base"),
      http("https://base-mainnet.g.alchemy.com/v2/WM5ly1JW2TrWhk8byZfTt2cpRVTpRUnw"),
      http(),
    ]),
  },
});


function Main() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CustomToaster/>
        <App/>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Main/>);
