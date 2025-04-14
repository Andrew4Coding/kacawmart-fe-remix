export async function uploadFile(file: File, key: string): Promise<string | undefined> {
    const formData = new FormData();
    formData.append('upload', file);
    formData.append('key', key);

    try {
        // nyobaaa nambahin await
        const response = fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        
        const data: { url: string, success: boolean } = await (await response).json();
        console.log("Upload response data:", data)

        if (data.success) {
            return data.url;
        }
        //nyoba juga
        return undefined // Explicitly return undefined if success is false
    }
    catch (error) {
        console.error(error);
    }
}