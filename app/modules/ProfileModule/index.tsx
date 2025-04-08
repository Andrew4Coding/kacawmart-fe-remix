import { useLoaderData, useOutletContext } from "@remix-run/react"
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
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Separator } from "~/components/ui/separator"
import { Switch } from "~/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"

// Sample user data based on the model
// const userData = {
//     id: "user_123456",
//     name: "Alex Johnson",
//     email: "alex.johnson@example.com",
//     emailVerified: true,
//     image: "https://randomuser.me/api/portraits/men/32.jpg",
//     createdAt: new Date("2022-03-15T10:30:00"),
//     updatedAt: new Date("2023-11-20T14:45:00"),
//     UserData: {
//         id: "userdata_123456",
//         city: "San Francisco",
//         province: "California",
//         postal: "94105",
//         gender: "MALE",
//         birthdate: new Date("1990-06-12T00:00:00"),
//         phone: "+1 (555) 123-4567",
//         profileImageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
//         isEnable2Fa: true,
//         lastLogin: new Date("2023-12-01T08:15:00"),
//         createdAt: new Date("2022-03-15T10:30:00"),
//         updatedAt: new Date("2023-11-20T14:45:00"),
//         walletId: "wallet_123456",
//         userId: "user_123456",
//     },
// }

interface userDataType {
    id: string;
    city: string;
    province: string;
    postal: string;
    gender: "MALE" | "FEMALE";
    birthdate: Date;
    phone: string;
    profileImageUrl: string;
    isEnable2Fa: boolean;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
    walletId: string | null;
    userId: string;
    wallet: {
        id: string;
        balance: number;
        userId: string;
    };
    Customer: Array<{
        id: string;
        category: string[];
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    Seller: Array<any>;
}

export default function ProfileModule() {
    const [isEditing, setIsEditing] = useState(false)
    const [activeTab, setActiveTab] = useState("personal")


    const contextData: {
        email: string;
        emailVerified: boolean;
        name: string;
        role: string;
    } = useOutletContext();
    const data: userDataType = useLoaderData();

    const [editedData, setEditedData] = useState({
        name: contextData.name,
        phone: data.phone,
        city: data.city,
        province: data.province,
        postal: data.postal,
    })

    const handleEditToggle = () => {
        if (isEditing) {
            // Save changes logic would go here
            // For now, we'll just toggle the edit state
            setIsEditing(false)
        } else {
            setIsEditing(true)
        }
    }

    const handleInputChange = (e: 
    React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setEditedData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const cancelEdit = () => {
        setEditedData({
            name: contextData.name,
            phone: data.phone,
            city: data.city,
            province: data.province,
            postal: data.postal,
        })
        setIsEditing(false)
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
    }

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
                                    <button className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full shadow-lg hover:bg-emerald-700 transition-colors">
                                        <Camera className="h-4 w-4" />
                                    </button>
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
                                            <p className="text-xs text-gray-500">
                                                {format(data.lastLogin, "MMMM d, yyyy 'at' h:mm a")}
                                            </p>
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
                                        onCheckedChange={() => { }}
                                        className="data-[state=checked]:bg-emerald-600"
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="border-t pt-6 flex justify-center">
                            <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
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
                                    className={
                                        isEditing ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }
                                >
                                    {isEditing ? (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </>
                                    ) : (
                                        <>
                                            <Edit2 className="h-4 w-4 mr-2" />
                                            Edit Profile
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>

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
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                {isEditing ? (
                                                    <Input id="name" name="name" value={editedData.name} onChange={handleInputChange} />
                                                ) : (
                                                    <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50">
                                                        <User className="h-4 w-4 text-gray-500 mr-2" />
                                                        <span>{contextData.name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50">
                                                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                                    <span>{contextData.email}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="gender">Gender</Label>
                                                {isEditing ? (
                                                    <Select defaultValue={data.gender}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select gender" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="MALE">Male</SelectItem>
                                                            <SelectItem value="FEMALE">Female</SelectItem>
                                                            <SelectItem value="OTHER">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50">
                                                        <span>
                                                            {data.gender === "MALE"
                                                                ? "Male"
                                                                : data.gender === "FEMALE"
                                                                    ? "Female"
                                                                    : "Other"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="birthdate">Date of Birth</Label>
                                                {isEditing ? (
                                                    <Input
                                                        id="birthdate"
                                                        type="date"
                                                        defaultValue={format(data.birthdate, "yyyy-MM-dd")}
                                                    />
                                                ) : (
                                                    <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50">
                                                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                                        <span>{format(data.birthdate, "MMMM d, yyyy")}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="contact" className="mt-0">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                {isEditing ? (
                                                    <Input id="phone" name="phone" value={editedData.phone} onChange={handleInputChange} />
                                                ) : (
                                                    <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50">
                                                        <Phone className="h-4 w-4 text-gray-500 mr-2" />
                                                        <span>{data.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Address</Label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    {isEditing ? (
                                                        <Input
                                                            placeholder="City"
                                                            name="city"
                                                            value={editedData.city}
                                                            onChange={handleInputChange}
                                                        />
                                                    ) : (
                                                        <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50">
                                                            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                                                            <span>{data.city}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    {isEditing ? (
                                                        <Input
                                                            placeholder="Province/State"
                                                            name="province"
                                                            value={editedData.province}
                                                            onChange={handleInputChange}
                                                        />
                                                    ) : (
                                                        <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50">
                                                            <span>{data.province}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    {isEditing ? (
                                                        <Input
                                                            placeholder="Postal Code"
                                                            name="postal"
                                                            value={editedData.postal}
                                                            onChange={handleInputChange}
                                                        />
                                                    ) : (
                                                        <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50">
                                                            <span>{data.postal}</span>
                                                        </div>
                                                    )}
                                                </div>
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
                                                    <Switch
                                                        checked={data.isEnable2Fa}
                                                        onCheckedChange={() => { }}
                                                        className="data-[state=checked]:bg-emerald-600"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {data.isEnable2Fa ? "Enabled" : "Disabled"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Password</h3>
                                            <Button variant="outline" className="w-full md:w-auto">
                                                Change Password
                                            </Button>
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
                                <Button variant="outline" onClick={cancelEdit}>
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button onClick={handleEditToggle} className="bg-emerald-600 hover:bg-emerald-700">
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}

