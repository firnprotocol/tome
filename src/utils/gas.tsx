// https://community.optimism.io/docs/developers/build/transaction-fees/#the-l1-data-fee

export function optimismTxDataGas(data) {
  // assumes txData isBytesLike
  data = data.slice(2); // cut off 0x
  let zeroBytes = 0;
  let nonZeroBytes = 0;
  for (let i = 0; i < data.length; i += 2) {
    if (data.slice(i, i + 2) === "00") zeroBytes++;
    else nonZeroBytes++;
  }
  return zeroBytes * 4 + nonZeroBytes * 16;
}
