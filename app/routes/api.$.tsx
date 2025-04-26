import type { ActionFunction, LoaderFunction } from "@remix-run/node";

const AUTH_URL = process.env.AUTH_URL || "http://localhost:4000";

// Handle GET requests
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const realApiResponse = await fetch(
    `${AUTH_URL}${url.pathname.replaceAll("api", "proxy")}`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: request.headers.get("Cookie") || "",
      },
      credentials: "include",
    },
  );

  const responseData = await realApiResponse.json();

  if (!realApiResponse.ok) {
    throw new Response(
      JSON.stringify({
        message: responseData.error || "Failed to fetch data",
        status: realApiResponse.status,
      }),
      {
        status: realApiResponse.status,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );
  }

  return new Response(
    JSON.stringify({
      ...responseData,
    }),
    {
      status: realApiResponse.status,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
};

// Handle POST, PUT, DELETE, etc.
export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  let body = {};
  try {
    body = await request.json();
  } catch {}

  const realApiResponse = await fetch(
    `${AUTH_URL}${url.pathname.replaceAll("api", "proxy")}`,
    {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: request.headers.get("Cookie") || "",
      },
      credentials: "include",
      body: request.method !== "GET" ? JSON.stringify(body) : null,
    },
  );

  const responseData = await realApiResponse.json();

  if (!realApiResponse.ok) {
    throw new Response(
      JSON.stringify({
        message: responseData.error || "Failed to fetch data",
        status: realApiResponse.status,
      }),
      {
        status: realApiResponse.status,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );
  }

  return new Response(
    JSON.stringify({
      message: responseData.message,
      token: responseData.token,
    }),
    {
      status: realApiResponse.status,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
};
