import { useEffect, useState } from "react";
import { useConfig, usePublicClient, useWatchContractEvent } from "wagmi";
import { getBlock } from "wagmi/actions";
import { decodeEventLog, parseAbiItem } from "viem";

import { formatDistanceTimestamp } from "@utils/datetime";
import { OrderedMutex } from "@utils/mutex";
import { LoadingSpinner } from "components/loading/LoadingSpinner";

import { Card } from "@tw/Card";
import { Grid } from "@tw/Grid";
import { ADDRESSES } from "constants/addresses";
import { TOME_ABI } from "constants/abis";
import { CHAIN_PARAMS } from "constants/networks";


export function MessageLog() {
  const config = useConfig();
  const publicClient = usePublicClient();

  const [pairs, setPairs] = useState([]);
  const [done, setDone] = useState(false);

  const mutex = new OrderedMutex();

  useEffect(() => {
    getBlock(config).then(async (block) => {
      const retrieve = async (i) => {
        const logs = await publicClient.getLogs({
          address: ADDRESSES["Base"].TOME,
          event: parseAbiItem("event Broadcast(address indexed, string)"),
          fromBlock: block.number - 1000n * (BigInt(i) + 1n) + 1n,
          toBlock: block.number - 1000n * BigInt(i),
        });
        const updates = await Promise.all(logs.map((log) => {
          const topics = decodeEventLog({
            abi: TOME_ABI,
            ...log,
          });
          return getBlock(config, { blockNumber: log.blockNumber }).then((block) => {
            return { ...log, ...topics, ...block }; // push to back of log.
          }); // .catch((error) => {}); ???
        }));
        await mutex.acquire(i);
        setPairs((pairs) => pairs.concat(updates.reverse())); // concat entire list to front.
        mutex.release();
      }
      for (let i = 0; i < 10; i++) {
        await Promise.all(Array.from({ length: 5 }).map((_, j) => retrieve(i * 5 + j)));
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }).catch((error) => {
      console.error(error);
      // { code: -32005, message: "please limit the query to at most 1000 blocks } // seem to get this on coinbase mobile browser?
      // { code: -32047, message: "Invalid eth_getLogs request. 'fromBlock'-'toBlock' range too large. Max range: 800" } // on WalletConnect
    }).finally(() => {
      setDone(true);
    });
  }, []);

  useWatchContractEvent({
    address: ADDRESSES["Base"].TOME,
    abi: TOME_ABI,
    eventName: "Broadcast",
    pollingInterval: 10000, // not fully tested whether this is doing anything.
    onLogs(logs) {
      logs.forEach((log) => {
        getBlock(config, { blockNumber: log.blockNumber }).then((block) => {
          setPairs((pairs) => [{ ...log, ...block }, ...pairs]);
        }); // .catch((error) => {}); ???
      });
    },
  });

  return (
    <Card title="RECENT MESSAGES" className="mt-2">
      <div className="pt-2 text-stone-700 text-sm flex">
        {done ?
          <span>Past messages retrieved.</span> :
          <span>Retrieving past messages... <LoadingSpinner className="!h-3.5 !w-3.5 mb-1"/></span>
        }
      </div>
      <Grid
        cols={{ xs: 1, sm: 1 }}
        gap={4}
        className="text-md text-slate-400 py-2"
      >
        {pairs.length > 0 || !done ?
          pairs.map((pair, i) => {
            return <MessageItem {...pair} key={i}/>; // if (i < 20), else return undefined
          }) :
          <span className="pt-2 text-sm text-yellow-700">There are currently no messages to show here.</span>
        }
      </Grid>
    </Card>
  );
}

function MessageItem({ args, timestamp, transactionHash }) {
  const { message } = args; // todo: better handling for long messages
  return (
    <a href={`${CHAIN_PARAMS["Base"].blockExplorerUrl}/tx/${transactionHash}#eventlog`} target="_blank">
      <div
        className="font-telegrama bg-stone-900 p-2 border-2 border-slate-800 hover:border-orange-500 hover:shadow-slate-100/20 rounded-md">
        <div className="text-sm inline pt-1">
          <div className="inline float-right text-sm text-amber-500">
            {formatDistanceTimestamp(Number(timestamp))}
          </div>
          {message}
        </div>
      </div>
    </a>
  );
}
