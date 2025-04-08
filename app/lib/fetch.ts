export default async function fetchServer(req: Request, url: string, options: RequestInit, token?: string) {
    const baseUrl = new URL(req.url);
    const fetchUrl = `${baseUrl.origin}${url}`;

    const response = await fetch(`${fetchUrl}`, {
        ...options,
        headers: {
            ...options.headers,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Cookie: req.headers.get('Cookie') || '',
        },
        credentials: 'include',
  });
  const data = await response.json();

  return data;
}