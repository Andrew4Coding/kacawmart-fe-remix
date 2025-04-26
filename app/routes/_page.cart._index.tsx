import CartModule from "~/modules/CartModule";
import cartLoader from "~/modules/CartModule/loader";

export const loader = cartLoader;
export default function CartPage() {
  return <CartModule />;
}
