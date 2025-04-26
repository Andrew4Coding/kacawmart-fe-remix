import { createCookie } from "@remix-run/node";

export const tokenCookie = createCookie("token", {
  sameSite: "lax",
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 5,
});

export async function getTokenFromRequest(request: Request) {
  const cookieHeader = request.headers.get("Cookie");

  const token = tokenCookie.parse(cookieHeader);

  return token;
}
