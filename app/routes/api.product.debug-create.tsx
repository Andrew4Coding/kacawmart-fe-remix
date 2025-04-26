import { type ActionFunctionArgs, json } from "@remix-run/node";
import { parse } from "cookie";

export async function action({ request }: ActionFunctionArgs) {
  console.log("Debug create endpoint called");

  try {
    // Check content type
    const contentType = request.headers.get("Content-Type");
    console.log("Content-Type:", contentType);

    let requestData: any = {};

    // Parse based on content type
    if (contentType?.includes("application/json")) {
      // Parse JSON data
      requestData = await request.json();
      console.log("Received JSON data:", requestData);
    } else {
      // Parse form data
      const formData = await request.formData();
      console.log("Form data entries:");

      // Convert FormData to object
      for (const [key, value] of formData.entries()) {
        requestData[key] =
          value instanceof File
            ? { name: value.name, type: value.type, size: value.size }
            : value;
        console.log(`${key}:`, requestData[key]);
      }
    }

    // Get authentication token from cookies
    const cookieHeader = request.headers.get("Cookie");
    const cookies = parse(cookieHeader || "");
    const token = cookies["x-user-token"];

    // Check if we have the expected fields for product creation
    const hasRequiredFields =
      requestData.name &&
      requestData.description &&
      requestData.categoryIds &&
      requestData.price &&
      requestData.stock &&
      requestData.imageUrl;

    // Return debug information
    return json({
      success: true,
      message: "Debug data received",
      data: requestData,
      validForProductCreation: hasRequiredFields,
      missingFields: !hasRequiredFields
        ? Object.entries({
            name: !!requestData.name,
            description: !!requestData.description,
            categoryIds: !!requestData.categoryIds,
            price: !!requestData.price,
            stock: !!requestData.stock,
            imageUrl: !!requestData.imageUrl,
          })
            .filter(([_, value]) => !value)
            .map(([key]) => key)
        : [],
      headers: {
        contentType,
        cookie: cookieHeader ? "Present" : "Not present",
        token: token ? "Present" : "Not present",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    return json(
      {
        success: false,
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
