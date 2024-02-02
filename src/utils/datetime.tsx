import { formatDistance } from "date-fns";

export function formatDistanceTimestamp(timestamp) {
  return formatDistance(new Date(timestamp * 1000), new Date(), { addSuffix: true });
}
