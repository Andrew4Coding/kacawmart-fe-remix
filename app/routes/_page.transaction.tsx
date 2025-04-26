import TransactionModule from "~/modules/TransactionModule";
import transactionLoader from "~/modules/TransactionModule/loader";

export { transactionLoader as loader };

export default function HistoryPage() {
  return <TransactionModule />;
}
