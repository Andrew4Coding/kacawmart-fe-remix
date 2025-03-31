const REAL_API_URL = process.env.API_URL || "http://localhost:8000";

export default async function fetchServer(url: string, options: RequestInit, token?: string) {
    const response = await fetch(`${REAL_API_URL}${url}`, {
        ...options,
        headers: {
            ...options.headers,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
  });
  const data = await response.json();

  return data;
}