export default async function fetchServer(
  req: Request,
  url: string,
  options?: RequestInit,
) {
  const baseUrl = new URL(req.url);
  const fetchUrl = `${baseUrl.origin}${url}`;

  const response = await fetch(`${fetchUrl}`, {
    ...options,
    headers: {
      ...options?.headers,
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: req.headers.get("Cookie") || "",
    },
    credentials: "include",
  });
  try {
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return {
      error: "Error parsing JSON response",
      status: response.status,
    };
  }
}
