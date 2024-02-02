import { useState } from "react";
import { Button } from "@tw/Button";
import { ButtonLoadingSpinner } from "@components/loading/ButtonLoadingSpinner";


export function SubmitTxButton({ className, onClick, pendingLabel, label, ...props }) {
  const [isPending, setIsPending] = useState(false);

  return (
    <Button
      fancy={true}
      className={`w-full font-telegrama rounded-lg ${className}`}
      onClick={async () => {
        setIsPending(true);
        try {
          await onClick();
        } finally {
          setIsPending(false);
        }
      }}
      {...props}
    >
      {isPending ?
        <>
          <span className="animate-pulse">
            {pendingLabel}
          </span>
          {" "}
          <ButtonLoadingSpinner className="-mt-1"/>
        </>
        :
        <span>{label}</span>
      }
    </Button>
  );
}
