import { TextField } from "@tw/TextField";


export function MessageField({
                               error,
                               helper,
                               display,
                               setDisplay,
                               locked,
                             }) {

  return (
    <TextField
      className="font-telegrama"
      placeholder="Enter your message here."
      value={display}
      onChange={(event) => {
        setDisplay(event.target.value);
      }}
      disabled={locked}
      helperText={helper}
      error={error}
    />
  );
}

