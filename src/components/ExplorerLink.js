import { useNetwork } from "wagmi";

import { CHAIN_PARAMS } from "constants/networks";


export function ExplorerLink({ hash, children, className }) {
  const { chain } = useNetwork();
  return (
    <a
      href={`${CHAIN_PARAMS[chain?.name]?.blockExplorerUrl}/tx/${hash}`}
      target="_blank"
      className={`${className} underline`}
    >
      {children ??
      <code>
        {hash.slice(0, 6)}...{hash.slice(-4)}
      </code>
      }
    </a>
  );
}

