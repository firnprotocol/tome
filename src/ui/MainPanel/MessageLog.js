import { useEffect, useState } from "react";
import { useConfig, useWatchContractEvent } from "wagmi";
import { getBlock, getPublicClient } from "wagmi/actions";
import { decodeEventLog, parseAbiItem } from "viem";

import { formatDistanceTimestamp } from "utils/datetime";
import { OrderedMutex } from "utils/mutex";
import { ButtonLoadingSpinner } from "components/loading/ButtonLoadingSpinner";

import { Card } from "tw/Card";
import { Grid } from "tw/Grid";
import { ADDRESSES } from "constants/addresses";
import { TOME_ABI } from "constants/abis";
import { CHAIN_PARAMS } from "constants/networks";


export function MessageLog() {
  const config = useConfig();
  const publicClient = getPublicClient(config);

  const [pairs, setPairs] = useState([]);
  const [done, setDone] = useState(false);

  const mutex = new OrderedMutex();

  useEffect(() => {
    getBlock(config).then((block) => {
      const retrieve = async (i) => {
        const logs = await publicClient.getLogs({
          address: ADDRESSES["Base"].TOME,
          event: parseAbiItem('event Broadcast(address indexed, string)'),
          fromBlock: block.number - 1000n * (BigInt(i) + 1n) + 1n,
          toBlock: block.number - 1000n * BigInt(i),
        });
        const updates = await Promise.all(logs.map((log) => {
          const topics = decodeEventLog({
            abi: TOME_ABI,
            ...log,
          });
          return getBlock(config, { blockNumber: log.blockNumber }).then((block) => {
            return { ...log, args: topics.args, timestamp: Number(block.timestamp) }; // push to back of log.
          }); // .catch((error) => {}); ???
        }));
        await mutex.acquire(i);
        setPairs((pairs) => pairs.concat(updates.reverse())); // concat entire list to front.
        mutex.release();
      };
      return Promise.all(Array.from({ length: 100 }).map((_, i) => retrieve(i))); // TEMPORARILY reduce to 10
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
    onLogs(logs) {
      logs.forEach((log) => {
        getBlock(config, { blockNumber: log.blockNumber }).then((block) => {
          setPairs((pairs) => [{ ...log, timestamp: Number(block.timestamp) }, ...pairs]);
        }); // .catch((error) => {}); ???
      });
    },
  });

  return (
    <Card title="RECENT MESSAGES" className="mt-2">
      <div className="pt-2 text-stone-700 text-sm flex">
        {done ?
          <span>Past messages retrieved.</span> :
          <span>Retrieving past messages... <ButtonLoadingSpinner className="!h-3.5 !w-3.5 mb-1 !opacity-100"/></span>
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
            {formatDistanceTimestamp(timestamp)}
          </div>
          {message}
        </div>
      </div>
    </a>
  );
}
