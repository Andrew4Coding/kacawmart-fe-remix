import { Outlet, Link } from "@remix-run/react";

export default function KacawPayLayout() {
  return (
    <div className="container">
      <h1>💰 KACAWPay</h1>
      <nav>
        <Link to="/kacawpay">Dashboard</Link> | 
        <Link to="/kacawpay/buy">Beli Voucher</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}
