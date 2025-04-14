import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import HomePageModule from "~/modules/HomePageModule";

export { loader } from "~/modules/HomePageModule/loader";

export const meta: MetaFunction = () => {
  return [
    { title: "KACAWmart - Belanja Gampang, Hidup Tenang" },
    { name: "description", content: "KACAWmart, tempat belanja online terpercaya dengan ribuan produk dan pengiriman cepat ke seluruh Indonesia." },
  ];
};

export default function HomePage() {
  return <HomePageModule />;
}