import { redirect } from "@remix-run/node";
import { tokenCookie } from "~/lib/cookie";

export async function loader() {
    return redirect('/', {
        headers: {
            'Set-Cookie': await tokenCookie.serialize('', {
                maxAge: 0,
            }),
        }
    });
}