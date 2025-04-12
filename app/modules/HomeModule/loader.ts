import { db } from "~/lib/prisma.server";
import { json } from "@remix-run/node";

export const loader = async () => {
  const kategoriProduk = await db.kategoriProduk.findMany();
  const produkTerlaris = await db.produk.findMany({
    orderBy: { terjual: "desc" },
    take: 8,
  });

  return json({
    description: "Belanja mudah & cepat di KACAWMart",
    kategoriProduk,
    produkTerlaris,
  });
};
