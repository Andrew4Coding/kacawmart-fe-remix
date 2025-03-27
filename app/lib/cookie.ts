import { createCookie } from "@remix-run/node";

export const tokenCookie = createCookie('token', {
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 5,
});


export function getTokenFromRequest(request: Request) {

    const cookieHeader = request.headers.get("Cookie");
    const cookies = Object.fromEntries(
        (cookieHeader || "").split("; ").map((c) => c.split("="))
    );
    
    return cookies.token as {token: string | undefined};
}