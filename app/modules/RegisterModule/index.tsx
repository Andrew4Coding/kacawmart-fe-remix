import { RegisterForm } from "./form";

export default function RegisterModule() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 py-40">
            <div className="w-full max-w-md">
                <RegisterForm />
            </div>
        </main>
    )
}