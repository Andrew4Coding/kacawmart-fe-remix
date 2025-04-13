// Function to upload an image and get back a URL
export async function uploadImage(file: File): Promise<string> {
    // Create a FormData instance
    const formData = new FormData()
    formData.append("file", file)
  
    try {
      // Call your image upload API endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
  
      if (!response.ok) {
        throw new Error("Image upload failed")
      }
  
      const data = await response.json()
      return data.imageUrl // Return the URL from the response
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }
  