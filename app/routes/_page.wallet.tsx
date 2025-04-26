import KacawPayModule from "~/modules/WallertPageModule";
import { loader } from "~/modules/WallertPageModule/loader";
import {
  topUpAction,
  buyVoucherAction,
} from "~/modules/WallertPageModule/actions";

export { loader };

export default function KacawPayPage() {
  return <KacawPayModule />;
}

export const action = async (args: any) => {
  const formData = await args.request.formData();
  const actionType = formData.get("_action");

  if (actionType === "topup") {
    return topUpAction(args);
  }

  if (actionType === "buy-voucher") {
    return buyVoucherAction(args);
  }

  return null;
};
