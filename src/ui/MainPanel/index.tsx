import { useAccount, useBlockNumber, useEstimateFeesPerGas, useReadContracts } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";

import { Grid } from "@tw/Grid";

import { ADDRESSES } from "constants/addresses";
import { ORACLE_ABI } from "constants/abis";
import { MainForm } from "@ui/MainForm";
import { MessageLog } from "@ui/MainPanel/MessageLog";
import { useEffect } from "react";


const BLOB_BASE_FEE_SCALAR = 810949n;
const BASE_FEE_SCALAR = 1368n;

export function MainPanel({ locked, setLocked }) {
  const queryClient = useQueryClient();

  const { chain } = useAccount();

  const { data: blockNumber } = useBlockNumber({ watch: true});
  const { data, isFetched, queryKey } = useEstimateFeesPerGas();

  const base = useReadContracts({
    contracts: [
      {
        address: ADDRESSES["Base"].ORACLE,
        abi: ORACLE_ABI,
        functionName: "l1BaseFee",
      },
      {
        address: ADDRESSES["Base"].ORACLE,
        abi: ORACLE_ABI,
        functionName: "blobBaseFee",
      },
    ],
    query: { enabled: chain?.name === "Base" },
  });
  useEffect(() => {
    if (!locked) {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: base.queryKey }); // (oracle)
    } // refresh balance on every block?
  }, [blockNumber, locked]);

  const calculators = {
    "Base": (l2Gas, txCompressedSize) => {
      if (!isFetched || !base.isFetched) return 0n; // || data.gasPrice === null
      const weightedGasPrice = (16n * BASE_FEE_SCALAR * base.data[0].result + BLOB_BASE_FEE_SCALAR * base.data[1].result) / 1000000n
      const l1DataFee = txCompressedSize * weightedGasPrice
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
