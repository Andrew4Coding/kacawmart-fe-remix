import HistoryModule from "~/modules/HistoryModule";
import historyLoader from "~/modules/HistoryModule/loader";

export { historyLoader as loader };

export default function HistoryPage() {
  return <HistoryModule />
}