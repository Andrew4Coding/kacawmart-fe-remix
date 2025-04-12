import { LoaderFunction, json } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const apiKey = process.env.API_KEY || "jawajawajawa";
  const userToken = process.env.USER_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRoSjlBbzE4aFNyejZ1bEZyckNWNlZJVmlTSThienkyIiwiZW1haWwiOiJhQGdtYWlsLmNvbSIsIm5hbWUiOiJBIiwicm9sZSI6ImN1c3RvbWVyIn0.FY4qt8GeptYSSPBpyJr9XhwLT0cpB4KO_wMswypPGU0";

  try {
    const res = await fetch("http://localhost:8000/api/home", {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "x-user-token": userToken,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch home data: ${res.statusText}`);
    }

    const result = await res.json();

    // Ambil data dari struktur JSON yang sesuai
    const { kategoriProduk = [], produkTerlaris = [] } = result.data || {};
    

    return json({
      kategoriProduk,
      produkTerlaris,
    });
  } catch (error) {
    console.error("Error fetching home data:", error);
    return json({
      kategoriProduk: [],
      produkTerlaris: [],
    });
  }
};
