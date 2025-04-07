import { useEffect } from "react";
import ProfileModule from "~/modules/ProfileModule";

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
    return <ProfileModule />;
}