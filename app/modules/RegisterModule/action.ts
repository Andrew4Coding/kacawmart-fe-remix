type RegisterData = {
    username: string;
    email: string;
    password: string;
    fullname: string;
    city: string;
    province: string;
    postal: string;
    gender: "L" | "P";
    birthdate: Date;
    phone: string;
    profileImageUrl: string;
    isEnable2Fa: boolean;
    bankName?: string;
    bankNumber?: string;
};

export async function registerUser(data: RegisterData) {
    const response = await fetch(`/api/auth/register/${data.bankName ? 'seller' : 'customer'}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
        return {
            success: false,
            message: responseData.message,
            error: responseData.error,
        };
    }

    return {
        success: true,
        message: "Your account has been created",
    };
}