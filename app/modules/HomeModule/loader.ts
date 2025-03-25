import { LoaderFunctionArgs } from "@remix-run/node";

export default function homeLoader(args: LoaderFunctionArgs) {
    console.log("Home loader");
    
    return null;
}