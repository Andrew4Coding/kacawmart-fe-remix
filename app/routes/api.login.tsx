import { ActionFunction, json } from "@remix-run/node";
import { getTokenFromRequest, tokenCookie } from "~/lib/cookie";

const REAL_API_URL = process.env.API_URL || "http://localhost:8000";

export const action: ActionFunction = async ({ request }) => {

    const body = await request.json();

    const token = await getTokenFromRequest(request);

    const realApiResponse = await fetch(`${REAL_API_URL}/api/auth/login`, {
        method: request.method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: request.method !== "GET" ?
            JSON.stringify(body)
            : null,
    });

    if (!realApiResponse.ok) {
        throw new Response("Failed to send data", { status: realApiResponse.status });
    }

    const responseData: { token: string, message: string } = await realApiResponse.json();

    return json({
        message: responseData.message
    }, {
        headers: {
            'Set-Cookie': await tokenCookie.serialize(responseData.token),
        },
    });
};