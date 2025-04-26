import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import ResetPasswordModule from "~/modules/ForgotPasswordModule/reset";

export async function loader(args: LoaderFunctionArgs) {
  const { request } = args;
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return redirect("/");
  }

  return null;
}

export default function Index() {
  return <ResetPasswordModule />;
}
