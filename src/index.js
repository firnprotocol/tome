import "./index.css";
import "./assets/telegrama.woff2";

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { base } from "viem/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { createRoot } from "react-dom/client";

import { CustomToaster } from "components/toasts/CustomToaster";

import { App } from "./App";


const { chains, publicClient, webSocketPublicClient } = configureChains(
  [base],
  [alchemyProvider({ apiKey: "WM5ly1JW2TrWhk8byZfTt2cpRVTpRUnw" }), publicProvider()],
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new MetaMaskConnector({
      chains
    }),
  ],
});

function Main() {
  return (
    <WagmiConfig config={config}>
      <App/>
      <CustomToaster/>
    </WagmiConfig>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Main/>);
