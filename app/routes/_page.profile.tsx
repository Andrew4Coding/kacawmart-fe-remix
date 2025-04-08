import { LoaderFunctionArgs } from "@remix-run/node";
import { useEffect } from "react";
import ProfileModule from "~/modules/ProfileModule";

export async function loader(args: LoaderFunctionArgs) {
    const response = await fetch(`${process.env.AUTH_URL}/user/profile`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Cookie: args.request.headers.get('Cookie') || '',
        },
        credentials: 'include',
    })

    try {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        return data;
    }

    catch (error) {
        console.error("Error fetching profile data:", error);
        return null;
    }
}

export default function Index() {
    useEffect(() => {
        fetch("/api/healthcheck").then((res) => {
            if (res.status !== 200) {
                throw new Error("Healthcheck failed");
            }
        }
        ).catch((err) => {
            console.error(err);
        }
        );
    }, [])
    return <ProfileModule
        
    />;
}