import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUserFromRequest } from "~/lib/auth-client";

export async function loader(args: LoaderFunctionArgs) {
    const userData = await getUserFromRequest(args.request);

    if (!userData || !userData.role || userData.role !== "seller") {
        return redirect("/");
    }

    return null;
}