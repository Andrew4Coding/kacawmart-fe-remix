export type LoginData = {
  username: string;
  password: string;
};

export async function loginUser(data: LoginData) {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const responseData: { message: string } = await response.json();

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
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}
