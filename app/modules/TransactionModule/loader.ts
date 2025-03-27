import { LoaderFunction } from "@remix-run/node";
import { getTokenFromRequest } from "~/lib/cookie";
import fetchServer from "~/lib/fetch";

const transactionLoader: LoaderFunction = async (args) => {
    const token = await getTokenFromRequest(args.request);
    const data = await fetchServer('/api/transaction/transactions', {}, token)

    return data;
}

export default transactionLoader;