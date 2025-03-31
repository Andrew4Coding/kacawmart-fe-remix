import { LoaderFunction } from "@remix-run/node";
import { getTokenFromRequest } from "~/lib/cookie";
import fetchServer from "~/lib/fetch";

const historyLoader: LoaderFunction = async (args) => {
    const token = await getTokenFromRequest(args.request);
    const data = await fetchServer('/api/transaction/transactions/orders', {}, token)
    console.log(data);
    

    return data;
}

export default historyLoader;