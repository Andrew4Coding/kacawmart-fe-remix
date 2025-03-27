import { redirect } from "@remix-run/node";

export async function loader() { 
    return redirect('/', { headers: { 'Set-Cookie': 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT' } });
}