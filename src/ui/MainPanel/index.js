import { useContractRead, useFeeData, useNetwork } from "wagmi";

import { Grid } from "tw/Grid";

import { ADDRESSES } from "constants/addresses";
import { ORACLE_ABI } from "constants/abis";
import { MainForm } from "ui/MainForm";
import { MessageLog } from "ui/MainPanel/MessageLog";


const FIXED_OVERHEAD = 188;
const DYNAMIC_OVERHEAD = 0.684;

export function MainPanel({ locked, setLocked }) {
  const { chain } = useNetwork();

  const { data, isFetched } = useFeeData({
    watch: !locked,
    onError(error) {
      console.error(error);
    },
  });
  const oracle = useContractRead({
    address: ADDRESSES["Base"].ORACLE,
    abi: ORACLE_ABI,
    functionName: "l1BaseFee",
    enabled: chain?.name === "Base", // kosher to have this inside?
    watch: !locked, // is this kosh?!?!? would be incredible if it was.
    onError(error) {
      console.error(error);
    },
  });

  const calculators = {
    "Base": (l2Gas, txDataGas) => {
      if (!isFetched || !oracle.isFetched) return 0n; // || data.gasPrice === null
      const l1GasPrice = oracle.data;
      const l1DataFee = l1GasPrice * BigInt(Math.ceil((txDataGas + FIXED_OVERHEAD) * DYNAMIC_OVERHEAD));
      const l2ExecutionFee = data.gasPrice * l2Gas;
      return l1DataFee + l2ExecutionFee;
    },
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
