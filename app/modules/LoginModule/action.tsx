type LoginData = {
    username: string;
    password: string;
};

export async function loginUser(data: LoginData) {
    try {
        const response = await fetch("http://localhost:8000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            mode : "cors",
            body: JSON.stringify(data),
        });

        const responseData: { token: string; message: string } = await response.json();
    
        if (!response.ok) {
            return {
                success: false,
                message: responseData.message,
            };
        }
    
        return {
            success: true,
            message: responseData.message,
        };
    }
    catch (error) {
        console.log(error);
        
        return {
            success: false,
            message: "An unexpected error occurred",
        };
    }
}