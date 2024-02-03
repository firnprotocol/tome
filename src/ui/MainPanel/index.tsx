import { useAccount, useBlockNumber, useEstimateFeesPerGas, useReadContract } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";

import { Grid } from "@tw/Grid";

import { ADDRESSES } from "constants/addresses";
import { ORACLE_ABI } from "constants/abis";
import { MainForm } from "@ui/MainForm";
import { MessageLog } from "@ui/MainPanel/MessageLog";
import { useEffect } from "react";


const FIXED_OVERHEAD = 188;
const DYNAMIC_OVERHEAD = 0.684;

export function MainPanel({ locked, setLocked }) {
  const queryClient = useQueryClient();

  const { chain } = useAccount();

  const { data: blockNumber } = useBlockNumber({ watch: true});
  const { data, isFetched, queryKey } = useEstimateFeesPerGas();

  const oracle = useReadContract({
    address: ADDRESSES["Base"].ORACLE,
    abi: ORACLE_ABI,
    functionName: "l1BaseFee",
    query: { enabled: chain?.name === "Base" },
  });

  useEffect(() => {
    if (!locked) {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: oracle.queryKey }); // (oracle)
    } // refresh balance on every block?
  }, [blockNumber, locked]);

  const calculators = {
    "Base": (l2Gas, txDataGas) => {
      if (!isFetched || !oracle.isFetched) return 0n; // || data.gasPrice === null
      const l1BaseFee = oracle.data;
      const l1DataFee = l1BaseFee * BigInt(Math.ceil((txDataGas + FIXED_OVERHEAD) * DYNAMIC_OVERHEAD));
      const l2ExecutionFee = data.maxFeePerGas * l2Gas;
      return l1DataFee + l2ExecutionFee;
    }
  };

  return (
    <Grid gap={2} cols={{ xs: 1 }}>
      <MainForm
        {...{ locked, setLocked, calculators }}
      />
      <MessageLog/>
    </Grid>
  );
}
