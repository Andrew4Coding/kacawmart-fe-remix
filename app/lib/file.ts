export async function uploadFile(file: File, key: string): Promise<string | undefined> {
    const formData = new FormData();
    formData.append('upload', file);
    formData.append('key', key);

    try {
        const response = fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        const data: { url: string, success: boolean } = (await response).json() as any;

        if (data.success) {
            return data.url;
        }
    }
    catch (error) {
        console.error(error);
    }
}