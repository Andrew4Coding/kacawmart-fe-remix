export async function uploadFile(file: File, key: string): Promise<string | undefined> {
    const formData = new FormData();
    formData.append('upload', file);
    formData.append('key', key);

    try {
        const response = fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        const data: { url: string, success: boolean } = await (await response).json();

        if (data.success) {
            return data.url;
        }
    }
    catch (error) {
        console.error(error);
    }
}