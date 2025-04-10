import { LoaderFunctionArgs } from "@remix-run/node";
import ForgotPasswordModule from "~/modules/ForgotPasswordModule/forgot";

export async function loader(args: LoaderFunctionArgs) {
    return null;
}

export default function Index() { 
    return <ForgotPasswordModule />
}