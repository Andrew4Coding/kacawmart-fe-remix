import CheckoutModule from "~/modules/CheckoutModule";
import checkoutLoader from "~/modules/CheckoutModule/loader";

export const loader = checkoutLoader;
export default function CheckoutPage() {
  return <CheckoutModule />
}