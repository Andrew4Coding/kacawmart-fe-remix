import { LoaderFunction } from "@remix-run/node";
import { getTokenFromRequest } from "~/lib/cookie";

const transactionLoader: LoaderFunction = async (args) => {
    const token = await getTokenFromRequest(args.request);
    const url = new URL(args.request.url);
    const fetchUrl = `${url.origin}/api/transaction/transactions`;
    const data = await fetch(fetchUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Cookie: args.request.headers.get("Cookie") || "",
        },
        credentials: "include",
    })

    const responseData = await data.json();
    
    return responseData;
}

export default transactionLoader;