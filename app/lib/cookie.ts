import { createCookie } from "@remix-run/node";

export const tokenCookie = createCookie('token', {
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 5,
});


export function getTokenFromRequest(request: Request) {
    const cookieHeader = request.headers.get('Cookie');
    return tokenCookie.parse(cookieHeader);
}