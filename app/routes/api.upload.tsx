import { type ActionFunctionArgs, json } from "@remix-run/node"
import { parse } from "cookie"

export async function action({ request }: ActionFunctionArgs) {
  // Check if the request is a POST request
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 })
  }

  try {
    // Get the form data from the request
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return json({ error: "No file provided" }, { status: 400 })
    }

    // Get authentication token from cookies
    const cookieHeader = request.headers.get("Cookie")
    const cookies = parse(cookieHeader || "")
    const token = cookies["x-user-token"]

    // Create a new FormData to send to your backend
    const uploadFormData = new FormData()
    uploadFormData.append("file", file)

    // Send the file to your backend upload endpoint
    const uploadResponse = await fetch(`${process.env.API_URL}/api/upload`, {
      method: "POST",
      body: uploadFormData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json()
      return json({ error: errorData.message || "Upload failed" }, { status: uploadResponse.status })
    }

    // Get the response from the backend
    const uploadResult = await uploadResponse.json()

    // Return the image URL
    return json({ imageUrl: uploadResult.url })
  } catch (error) {
    console.error("Error uploading file:", error)
    return json({ error: "Failed to upload file" }, { status: 500 })
  }
}
