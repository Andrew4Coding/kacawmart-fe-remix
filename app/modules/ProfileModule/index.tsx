import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useLoaderData, useOutletContext } from "@remix-run/react"
import { format } from "date-fns"
import {
    Calendar,
    Camera,
    ChevronRight,
    Clock,
    Edit2,
    LogOut,
    Mail,
    MapPin,
    Phone,
    Save,
    Shield,
    User,
    X,
} from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Separator } from "~/components/ui/separator"
import { Switch } from "~/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"

// Define Zod schema for form validation
const profileFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().regex(/^\+\d{10,14}$/, "Phone number must be in international format (e.g., +1234567890)"),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province/State is required"),
    postal: z.string().min(1, "Postal code is required"),
    gender: z.enum(["P", "L"]),
    birthdate: z.date({
        required_error: "Birthdate is required",
    }),
    isEnable2Fa: z.boolean().default(false),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface userDataType {
    id: string
    city: string
    province: string
    postal: string
    gender: "L" | "P"
    birthdate: Date
    phone: string
    profileImageUrl: string
    isEnable2Fa: boolean
    lastLogin: Date
    createdAt: Date
    updatedAt: Date
    walletId: string | null
    userId: string
    wallet: {
        id: string
        balance: number
        userId: string
    }
    Customer: Array<{
        id: string
        category: string[]
        userId: string
        createdAt: Date
        updatedAt: Date
    }>
    Seller: Array<any>,
    authUrl: string
}

export default function ProfileModule() {
    const [isEditing, setIsEditing] = useState(false)
    const [activeTab, setActiveTab] = useState("personal")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const contextData: {
        email: string
        emailVerified: boolean
        name: string
        role: string
    } = useOutletContext();

    const data: userDataType = useLoaderData();


    // Initialize form with react-hook-form and zod validation
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: contextData.name,
            phone: data.phone,
            city: data.city,
            province: data.province,
            postal: data.postal,
            gender: data.gender,
            birthdate: new Date(data.birthdate),
            isEnable2Fa: data.isEnable2Fa,
        },
    })

    const handleEditToggle = () => {
        if (isEditing) {
            form.handleSubmit(onSubmit)()
        } else {
            setIsEditing(true)
        }
    }

    const cancelEdit = () => {
        form.reset({
            name: contextData.name,
            phone: data.phone,
            city: data.city,
            province: data.province,
            postal: data.postal,
            gender: data.gender,
            birthdate: new Date(data.birthdate),
            isEnable2Fa: data.isEnable2Fa,
        })
        setIsEditing(false)
    }

    // Form submission handler
    async function onSubmit(values: ProfileFormValues) {
        setIsSubmitting(true)

        try {
            fetch(`${data.authUrl}/user/edit/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Cookie: document.cookie,
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...values,
                    birthdate: format(values.birthdate, "yyyy-MM-dd"),
                }),
            }).then((res) => {
                if (res.status !== 200) {
                    throw new Error("Healthcheck failed")
                }

                return res;
            })
                .then(async (res) => {
                    const data = await res.json()

                    console.log("Profile data:", data);

                    // Update successful
                    toast.success("Profile updated successfully")
                    setIsEditing(false)
                })
                .catch((err) => {
                    console.error(err);
                    // Handle error
                    toast.error("Failed to update profile. Please try again.")
                }
                );



            // You might want to refresh the data here or update the context
            // For example:
            // refreshUserData();
        } catch (error) {
            // Handle error
            toast.error("Failed to update profile. Please try again.")
            console.error("Profile update error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
    }

    const [profileImage, setProfileImage] = useState<File | null>(null);

    return (
        <div className="container mx-auto py-10 px-4 md:px-6 max-w-6xl pt-40">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="border-0 shadow-md overflow-hidden">
                        <div className="relative h-32 bg-gradient-to-r from-emerald-500 to-teal-600">
                            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                                <div className="relative">
                                    <Avatar className="w-32 h-32 border-4 border-white">
                                        <AvatarImage src={data.profileImageUrl} alt={contextData.name} />
                                        <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-700">
                                            {getInitials(contextData.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <button
                                        onClick={() => {
                                            // Handle image upload here
                                            console.log("Upload new profile image")
                                        }}
                                        className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full shadow-lg hover:bg-emerald-700 transition-colors">
                                        <Camera className="h-4 w-4" />
                                    </button>
                                    <input type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                const file = e.target.files[0]
                                                setProfileImage(file)
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <CardContent className="pt-20 pb-6 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mt-2">{contextData.name}</h2>
                            <p className="text-gray-500">{contextData.email}</p>

                            <div className="flex justify-center mt-4">
                                {contextData.emailVerified ? (
                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors">
                                        Email Verified
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="border-amber-300 text-amber-600">
                                        Email Not Verified
                                    </Badge>
                                )}
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Member Since</p>
                                            <p className="text-xs text-gray-500">{format(data.createdAt, "MMMM d, yyyy")}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <Clock className="h-5 w-5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Last Login</p>
                                            <p className="text-xs text-gray-500">{format(data.lastLogin, "MMMM d, yyyy 'at' h:mm a")}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <Shield className="h-5 w-5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Two-Factor Auth</p>
                                            <p className="text-xs text-gray-500">{data.isEnable2Fa ? "Enabled" : "Disabled"}</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={data.isEnable2Fa}
                                        onCheckedChange={(checked) => {
                                            form.setValue("isEnable2Fa", checked)
                                        }}
                                        className="data-[state=checked]:bg-emerald-600"
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="border-t pt-6 flex justify-center">
                            <Link
                                to="/logout"
                            >
                                <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sign Out
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2">
                    <Card className="border-0 shadow-md">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl">Profile Information</CardTitle>
                                    <CardDescription>Manage your personal information and preferences</CardDescription>
                                </div>
                                <Button
                                    onClick={handleEditToggle}
                                    disabled={isSubmitting}
                                    className={
                                        isEditing ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }
                                >
                                    {isEditing ? (
                                        isSubmitting ? (
                                            <>
                                                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Changes
                                            </>
                                        )
                                    ) : (
                                        <>
                                            <Edit2 className="h-4 w-4 mr-2" />
                                            Edit Profile
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <CardContent className="pt-0 pb-4">
                                        <TabsList className="grid grid-cols-3 mb-6">
                                            <TabsTrigger
                                                value="personal"
                                                className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
                                            >
                                                Personal
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="contact"
                                                className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
                                            >
                                                Contact
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="security"
                                                className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
                                            >
                                                Security
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="personal" className="mt-0">
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <FormField
                                                        control={form.control}
                                                        name="name"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Full Name</FormLabel>
                                                                <FormControl>
                                                                    {isEditing ? (
                                                                        <div className="relative">
                                                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                                                            <Input className="pl-10" {...field} />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50">
                                                                            <User className="h-4 w-4 text-gray-500 mr-2" />
                                                                            <span>{field.value}</span>
                                                                        </div>
                                                                    )}
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <div className="space-y-2">
                                                        <Label htmlFor="email">Email Address</Label>
                                                        <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50">
                                                            <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                                            <span>{contextData.email}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <FormField
                                                        control={form.control}
                                                        name="gender"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Gender</FormLabel>
                                                                <FormControl>
                                                                    {isEditing ? (
                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select gender" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="L">Male</SelectItem>
                                                                                <SelectItem value="P">Female</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    ) : (
                                                                        <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50">
                                                                            <span>
                                                                                {field.value === "L"
                                                                                    ? "L"
                                                                                    : field.value === "P"
                                                                                        ? "P"
                                                                                        : "Other"}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="birthdate"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Date of Birth</FormLabel>
                                                                <FormControl>
                                                                    {isEditing ? (
                                                                        <Input
                                                                            type="date"
                                                                            value={format(field.value, "yyyy-MM-dd")}
                                                                            onChange={(e) => {
                                                                                const date = new Date(e.target.value)
                                                                                field.onChange(date)
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50">
                                                                            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                                                            <span>{format(field.value, "MMMM d, yyyy")}</span>
                                                                        </div>
                                                                    )}
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="contact" className="mt-0">
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <FormField
                                                        control={form.control}
                                                        name="phone"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Phone Number</FormLabel>
                                                                <FormControl>
                                                                    {isEditing ? (
                                                                        <div className="relative">
                                                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                                                            <Input className="pl-10" {...field} />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50">
                                                                            <Phone className="h-4 w-4 text-gray-500 mr-2" />
                                                                            <span>{field.value}</span>
                                                                        </div>
                                                                    )}
                                                                </FormControl>
                                                                <FormDescription>
                                                                    Enter your phone number in international format (e.g., +1234567890)
                                                                </FormDescription>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Address</Label>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name="city"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        {isEditing ? (
                                                                            <div className="relative">
                                                                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                                                                <Input placeholder="City" className="pl-10" {...field} />
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50">
                                                                                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                                                                                <span>{field.value}</span>
                                                                            </div>
                                                                        )}
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
                                                                    <FormControl>
                                                                        {isEditing ? (
                                                                            <Input placeholder="Province/State" {...field} />
                                                                        ) : (
                                                                            <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50">
                                                                                <span>{field.value}</span>
                                                                            </div>
                                                                        )}
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
                                                                    <FormControl>
                                                                        {isEditing ? (
                                                                            <Input placeholder="Postal Code" {...field} />
                                                                        ) : (
                                                                            <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50">
                                                                                <span>{field.value}</span>
                                                                            </div>
                                                                        )}
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="security" className="mt-0">
                                            <div className="space-y-6">
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-start space-x-3">
                                                            <Shield className="h-10 w-10 text-emerald-600 mt-1" />
                                                            <div>
                                                                <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                                                                <p className="text-gray-500 text-sm">
                                                                    Add an extra layer of security to your account by enabling two-factor authentication.
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <FormField
                                                                control={form.control}
                                                                name="isEnable2Fa"
                                                                render={({ field }) => (
                                                                    <FormItem className="flex items-center space-x-2">
                                                                        <FormControl>
                                                                            <Switch
                                                                                checked={field.value}
                                                                                onCheckedChange={field.onChange}
                                                                                className="data-[state=checked]:bg-emerald-600"
                                                                                disabled={!isEditing}
                                                                            />
                                                                        </FormControl>
                                                                        <span className="text-sm font-medium text-gray-700">
                                                                            {field.value ? "Enabled" : "Disabled"}
                                                                        </span>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Password</h3>
                                                    <Link
                                                        to="/forgot-password"
                                                    >
                                                        <Button variant="outline" className="w-full md:w-auto">
                                                            Change Password
                                                        </Button>
                                                    </Link>
                                                </div>

                                                <Separator />

                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Account Activity</h3>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="bg-blue-100 p-2 rounded-full">
                                                                    <User className="h-4 w-4 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium">Profile Updated</p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {format(data.updatedAt, "MMMM d, yyyy 'at' h:mm a")}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                                        </div>

                                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="bg-green-100 p-2 rounded-full">
                                                                    <Shield className="h-4 w-4 text-green-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium">Last Successful Login</p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {format(data.lastLogin, "MMMM d, yyyy 'at' h:mm a")}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </CardContent>
                                </Tabs>

                                {isEditing && (
                                    <CardFooter className="border-t pt-4 flex justify-end space-x-2">
                                        <Button type="button" variant="outline" onClick={cancelEdit} disabled={isSubmitting}>
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </CardFooter>
                                )}
                            </form>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>
    )
}
