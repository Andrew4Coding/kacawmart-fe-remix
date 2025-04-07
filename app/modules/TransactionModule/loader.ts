import { LoaderFunction } from "@remix-run/node";
import fetchServer from "~/lib/fetch";

const transactionLoader: LoaderFunction = async (args) => {
    const data = await fetchServer(args.request, "/api/transaction/transactions", {});
    
    return data;
}

export default transactionLoader;