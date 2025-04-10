"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Link } from "@remix-run/react"
import { AlertCircle, KeyRound, Mail } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { cn } from "~/lib/utils"
import { getServerAuthClient } from "~/lib/auth-client"

const loginSchema = z.object({
    username: z.string().min(1, "Email or username is required"),
    password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const authClient = getServerAuthClient();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(data: LoginFormValues) {
        setIsLoading(true)
        setError(null)

        try {
            await authClient.signIn.email({
                email: data.username,
                password: data.password,
                callbackURL: '/',
                rememberMe: true,
            }, {
                onSuccess: () => {
                    toast.success("Login successful");
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                    setError(ctx.error.message);
                },
            })
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to login"
            toast.error(message)
            setError(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md font-open">
            <Card className="border-none shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-center text-2xl font-bold">Welcome back</CardTitle>
                    <CardDescription className="text-center text-sm text-muted-foreground">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    {error && (
                        <Alert variant="destructive" className="mb-6 animate-in fade-in-50">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Email or Username</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    placeholder="Enter your email or username"
                                                    className={cn(
                                                        "pl-10 transition-all focus-visible:ring-2 focus-visible:ring-offset-1",
                                                        form.formState.errors.username && "focus-visible:ring-destructive",
                                                    )}
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-sm font-medium">Password</FormLabel>
                                            <Link
                                                to="/forgot-password"
                                                className="text-xs text-slate-500 hover:text-slate-800 hover:underline"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className={cn(
                                                        "pl-10 transition-all focus-visible:ring-2 focus-visible:ring-offset-1",
                                                        form.formState.errors.password && "focus-visible:ring-destructive",
                                                    )}
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-200/20"></div>
                                        <span>Logging in...</span>
                                    </div>
                                ) : (
                                    "Sign in"
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Button variant="outline" className="h-11">
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                    <path d="M1 1h22v22H1z" fill="none" />
                                </svg>
                                Google
                            </Button>
                            <Button variant="outline" className="h-11">
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M9.09 16.59L4.5 12l4.59-4.59L8.09 6.41 2.5 12l5.59 5.59 1-1zm5.82-1L19.5 12l-4.59-4.59L13.91 6.41 19.5 12l-5.59 5.59-1-1z"
                                        fill="currentColor"
                                    />
                                </svg>
                                GitHub
                            </Button>
                        </div>
                    </div> */}
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center border-t p-6">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-medium text-slate-900 hover:underline">
                            Create an account
                        </Link>
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                        By continuing, you agree to our{" "}
                        <Link to="/terms" className="hover:text-slate-800 hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="hover:text-slate-800 hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
