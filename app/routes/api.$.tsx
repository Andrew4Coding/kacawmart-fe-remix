import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getTokenFromRequest } from "~/lib/cookie";

const REAL_API_URL = process.env.API_URL || "http://localhost:8000";

// Handle GET requests
export const loader: LoaderFunction = async ({ request }) => {
    const token = await getTokenFromRequest(request);

    const url = new URL(request.url);
    const realApiResponse = await fetch(`${REAL_API_URL}${url.pathname}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
    });

    if (!realApiResponse.ok) {
        throw new Response("Failed to fetch data", { status: realApiResponse.status });
    }

    return json(await realApiResponse.json());
};

// Handle POST, PUT, DELETE, etc.
export const action: ActionFunction = async ({ request }) => {
    const url = new URL(request.url);
    const body = await request.json();

    const token = await getTokenFromRequest(request);

    const realApiResponse = await fetch(`${REAL_API_URL}${url.pathname}`, {
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

    return json(responseData);
};
