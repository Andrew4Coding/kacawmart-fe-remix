import { LoaderFunction } from "@remix-run/node";
import fetchServer from "~/lib/fetch";

const historyLoader: LoaderFunction = async (args) => {
  const data = await fetchServer(
    args.request,
    "/api/transaction/transactions/orders",
  );
  console.log(data);

  return data;
};

export default historyLoader;
