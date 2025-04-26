import { type ActionFunctionArgs, json } from "@remix-run/node";
import fetchServer from "~/lib/fetch";

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("Upload endpoint called");

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const key = formData.get("key") as string | null;

    if (!file) {
      return json({ error: "No file provided" }, { status: 400 });
    }

    // Forward to the working /upload endpoint using fetchServer
    const forwardFormData = new FormData();
    forwardFormData.append("upload", file);
    if (key) forwardFormData.append("key", key);

    console.log("Forwarding to /upload via fetchServer");

    const uploadResponse = await fetchServer(request, "/upload", {
      method: "POST",
      body: forwardFormData,
      headers: {
        // No need to set Content-Type for FormData
      },
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("Upload failed:", errorText);
      throw new Error(`Upload failed: ${errorText}`);
    }

    const data = await uploadResponse.json();

    if (!data.url && !data.imageUrl) {
      console.error("Upload succeeded but missing URL");
      throw new Error("Upload succeeded but no URL returned");
    }

    return json({
      imageUrl: data.url || data.imageUrl,
      url: data.url || data.imageUrl,
      success: true,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return json({ error: String(error), success: false }, { status: 500 });
  }
};

export const loader = async () => {
  return json({ message: "Upload endpoint is working" });
};
