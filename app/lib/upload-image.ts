// Function to upload an image and get back a URL
export async function uploadImage(file: File): Promise<string> {
  console.log("uploadImage called with file:", file.name, file.type, file.size);

  // Create a FormData instance
  const formData = new FormData();
  formData.append("file", file);

  try {
    console.log("Sending upload request to /api/upload");
    // Call your image upload API endpoint
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    console.log("Upload response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed:", errorText);
      throw new Error(`Image upload failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("Upload response data:", data);

    if (!data.url && !data.imageUrl) {
      console.error("No URL in response:", data);
      throw new Error("Invalid response from upload endpoint");
    }

    // Return the URL from the response (either url or imageUrl)
    return data.url || data.imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
