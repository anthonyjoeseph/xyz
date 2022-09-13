import type { ReactElement } from "react";
import { ClientOnly } from "remix-utils";
import { WagmiConfig, createClient, configureChains, chain, defaultChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { infuraProvider } from "wagmi/providers/infura";

export default function WalletProvider({ children, network }: { children: ReactElement; network: string }) {
  let configureChainObj;

  //TODO create config of all chains we support

  // By adding defaultChains to all instances, we avoid the message when on the wrong network of:
  // "switch to chain {chain.id}" instead of chain name. The ID is used when the currently connected chain
  // is not in our configured chains. We don't have to stick with this set up but this will allow most chains to
  // show the proper name.
  const infuraId = "54fcc811bac44f99b84a04a4a3e2f998";
  if (network === "ropsten") {
    configureChainObj = configureChains(defaultChains, [infuraProvider({ apiKey: infuraId }), publicProvider()]);
  } else if (network === "polygon") {
    configureChainObj = configureChains([...defaultChains, chain.polygon], [infuraProvider({ apiKey: infuraId }), publicProvider()]);
  } else if (network === "localhost") {
    configureChainObj = configureChains([...defaultChains, chain.polygon, chain.hardhat, chain.localhost], [publicProvider()]);
  } else {
    //nothing provided will lead to front end error
    configureChainObj = configureChains(defaultChains, [publicProvider()]);
  }
  const { chains, provider, webSocketProvider } = configureChainObj;

  // Set up client
  const client = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: "question API",
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: "Injected",
          shimDisconnect: true,
        },
      }),
    ],
    provider,
    webSocketProvider,
  });

  return (
    <ClientOnly>
      {() => {
        if (!network) {
          window.alert("Please configure Network");
          return null;
        }
        return <WagmiConfig client={client}>{children}</WagmiConfig>;
      }}
    </ClientOnly>
  );
}
