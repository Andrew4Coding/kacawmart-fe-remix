import { useLoaderData } from "@remix-run/react"
import { Transaction } from "./type";

export default function TransactionModule() {
    const data: Transaction[] = useLoaderData();

    return (
        <main className="px-20 py-10 flex gap-10 min-h-screen w-full">
            <div className="w-[40%]">

            </div>
            <div>

            </div>
        </main>
    )
}