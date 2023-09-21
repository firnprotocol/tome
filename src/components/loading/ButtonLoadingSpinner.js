import { LoadingSpinner } from "components/loading/LoadingSpinner";

export function ButtonLoadingSpinner({ className }) {
  return (
    <LoadingSpinner className={`opacity-50 ${className}`}/>
  );
}
