import { LoadingSpinner } from "@components/loading/LoadingSpinner";

export function ButtonLoadingSpinner({ className }) {
  return (
    <LoadingSpinner className={`!text-gray-50 opacity-50 ${className}`}/>
  );
}
