"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Link, useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import { AlertCircle, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { FileInput } from "~/components/ui/file-input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { uploadFile } from "~/lib/file";
import { cn } from "~/lib/utils";
import { registerUser } from "./action";
const GENDER = {
    L: "L",
    P: "P",
} as const;

const registerSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z
        .string()
        .min(8)
        .max(100)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        ),
    fullname: z.string(),
    city: z.string(),
    province: z.string(),
    postal: z.string(),
    gender: z.nativeEnum(GENDER),
    birthdate: z.date(),
    phone: z
        .string()
        .regex(/^\+\d{10,14}$/, "Phone number must be in international format"),
    profileImageUrl: z.string().url().optional(),
    profileAttachment: z
        .instanceof(File)
        .refine(
            (file) => file.size < 5 * 1024 * 1024,
            "File size must be less than 5MB",
        )
        .refine((file) => file.type.startsWith("image/"))
        .optional(),
    isEnable2Fa: z.boolean(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState("personal");

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            gender: "L",
            birthdate: new Date(),
            isEnable2Fa: false,
        },
    });

    async function onSubmit(data: RegisterFormValues) {
        setIsLoading(true);
        setError(null);

        try {
            // Create a FormData object if there's a file to upload
            if (data.profileAttachment) {
                const formData = new FormData();

                // Append all form data
                Object.entries(data).forEach(([key, value]) => {
                    if (key === "profileAttachment" && value instanceof File) {
                        formData.append(key, value);
                    } else if (key === "birthdate" && value instanceof Date) {
                        formData.append(key, value.toISOString());
                    } else if (value !== undefined && value !== null) {
                        formData.append(key, String(value));
                    }
                });
            }

            const profileImageUrl = await uploadFile(
                data.profileAttachment as File,
                `${data.username}`,
            );

            console.log(profileImageUrl);
            

            if (!profileImageUrl) {
                setError("An error occurred while uploading the profile photo");
                return;
            }

            // In a real app, this would call your registration API
            const result = await registerUser({
                ...data,
                profileImageUrl: profileImageUrl,
                birthdate: new Date(data.birthdate),
            });

            if (result.success) {
                toast.success("Registration successful");
                navigate("/login");
            } else {
                console.log(result);

                setError(result.message || "An error occurred during registration");
            }
        } catch (error) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl">Register</CardTitle>
                <CardDescription>Create a new account to get started</CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Tabs value={currentTab} onValueChange={setCurrentTab}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                                <TabsTrigger value="address">Address & Details</TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal" className="space-y-4 mt-4">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Username" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="email@example.com"
                                                    {...field}
                                                />
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
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="fullname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+1234567890" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="profileAttachment"
                                    render={({ field: { value, onChange, ...fieldProps } }) => (
                                        <FormItem>
                                            <FormLabel>Profile Photo</FormLabel>
                                            <FormControl>
                                                <FileInput
                                                    file={
                                                        form.getValues(`profileAttachment`) as File | null
                                                    }
                                                    onFileChange={(file: File) => {
                                                        form.setValue(`profileAttachment`, file);
                                                    }}
                                                    secondaryMessage="Upload a profile photo"
                                                    asterisk
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        onClick={() => setCurrentTab("address")}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="address" className="space-y-4 mt-4">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input placeholder="New York" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="province"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Province/State</FormLabel>
                                            <FormControl>
                                                <Input placeholder="NY" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="postal"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Postal/Zip Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="10001" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="L">Male</SelectItem>
                                                    <SelectItem value="P">Female</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="birthdate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Birthdate</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground",
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-between">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCurrentTab("personal")}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        onClick={() => {
                                            console.log(form.getValues());
                                        }}
                                    >
                                        {isLoading ? "Registering..." : "Register"}
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                        Login
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
