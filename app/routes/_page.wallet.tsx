import KacawPayModule from "~/modules/KacawPayModule";
import { loader } from "~/modules/KacawPayModule/loader";
import { topUpAction, buyVoucherAction } from "~/modules/KacawPayModule/actions";

export { loader };

export default function KacawPayPage() {
  return <KacawPayModule />;
}

export const action = async (args: any) => {
  const formData = await args.request.formData();
  const actionType = formData.get('_action');
  
  if (actionType === 'topup') {
    return topUpAction(args);
  }
  
  if (actionType === 'buy-voucher') {
    return buyVoucherAction(args);
  }
  
  return null;
};