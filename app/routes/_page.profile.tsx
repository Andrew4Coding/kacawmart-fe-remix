import { json, LoaderFunctionArgs, ActionFunctionArgs, redirect } from "@remix-run/node"; 
import { useLoaderData, useActionData, useNavigation, Form as RemixForm, useSubmit } from "@remix-run/react";
import { format } from "date-fns";

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

        return {
            ...data,
            authUrl: process.env.AUTH_URL,
        };
    }

    catch (error) {
        console.error("Error fetching profile data:", error);
        return null;
    }
}

export default function Index() {
    return <ProfileModule />;
}