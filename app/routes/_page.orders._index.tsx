import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import fetchServer from "~/lib/fetch";
import OrderModule from "~/modules/OrderModule"

// Sample data based on the provided structure
// const sampleOrders = [
//   {
//     id: "cm9a9sc3j04h9xldnoumerxyk",
//     deliveryStatus: "DELIVERED",
//     totalPrice: 2483549,
//     totalProduct: 5,
//     transactionId: "cm9a9sbhg048dxldny48d9shv",
//     discountId: "cm9a9sa7m041lxldnqe242n3d",
//     createdAt: "2025-04-09T18:35:51.487Z",
//     updatedAt: "2025-04-09T18:35:51.487Z",
//     product: [
//       {
//         id: "cm9a9ruxt00nkxldno2t9qk27",
//         amount: 92,
//         price: 957009,
//         productId: "cm9a9ruxl00njxldnmfexc58l",
//         product: {
//           id: "cm9a9ruxl00njxldnmfexc58l",
//           name: "Portronics Konnect L 1.2M Fast Charging 3A 8 Pin USB Cable with Charge & Sync Function for iPhone, iPad (Grey)",
//           description:
//             "[CHARGE & SYNC FUNCTION]- This cable comes with charging & Data sync function|[HIGH QUALITY MATERIAL]- TPE + Nylon Material to make sure that the life of the cable is enhanced significantly|[LONG CORD]- The Cable is extra thick 1.2 meter long, optimized for an easy use for your comfort at home or office|[MORE DURABLE]-This cable is unique interms of design and multi-use and is positioned to provide the best comfort and performance while using|[UNIVERSAL COMPATIBILITY]- Compatible with all devices like iPhone XS, X, XR, 8, 7, 6S, 6, 5S, iPad Pro, iPad mini and iPad Air",
//           price: 957009,
//           imageUrl:
//             "https://m.media-amazon.com/images/W/WEBP_402378-T2/images/I/31VzNhhqifL._SX300_SY300_QL70_FMwebp_.jpg",
//           ratingCount: 1,
//           productRating: 4,
//           stock: 236,
//         },
//       },
//       {
//         id: "cm9a9rve700q4xldnp69ksdq5",
//         amount: 61,
//         price: 566320,
//         productId: "cm9a9rvdz00q3xldn1w7d6dri",
//         product: {
//           id: "cm9a9rvdz00q3xldn1w7d6dri",
//           name: "TP-Link AC600 600 Mbps WiFi Wireless Network USB Adapter for Desktop PC with 2.4GHz/5GHz High Gain Dual Band 5dBi Antenna Wi-Fi, Supports Windows 11/10/8.1/8/7/XP, Mac OS 10.15 and earlier (Archer T2U Plus)",
//           description:
//             "High-Speed Wi-Fi —— 256QAM support increases the 2.4 GHz data rate from 150 Mbps to 200 Mbps, 200 Mbps on the 2.4 GHz band and 433 Mbps on the 5 GHz band, ensure you fully enjoy fast AC Wi-Fi.|Dual Band Wireless —— 2.4 GHz and 5 GHz band provide flexible connectivity, giving your devices access to the latest dual-band Wi-Fi router for faster speed and extended range|High-Gain Antenna —— A 5dBi high-gain antenna greatly enhances the reception and transmission signal strength of the USB adapter|Supports the Latest Operating Systems —— Fully compatible with Windows 11/10/8.1/8/7/XP, Mac OS 10.15 and earlier|In an unlikely case of product quality related issue, we may ask you to reach out to brand's customer service support and seek resolution. We will require brand proof of issue to process replacement request.",
//           price: 566320,
//           imageUrl: "https://m.media-amazon.com/images/I/216Q4FqmZVL._SX300_SY300_QL70_FMwebp_.jpg",
//           ratingCount: 165,
//           productRating: 3,
//           stock: 47,
//         },
//       },
//       {
//         id: "cm9a9rxsu013gxldn9kw06jo2",
//         amount: 94,
//         price: 960220,
//         productId: "cm9a9rxsn013fxldnh9kk4fg0",
//         product: {
//           id: "cm9a9rxsn013fxldnh9kk4fg0",
//           name: "Firestick Remote",
//           description:
//             "by JBDE | Compatible For Amazon Fire TV Stick (3rd Gen, 2021) | Compatible For Amazon Fire TV Stick Lite | Compatible For Amazon Fire TV Stick (2nd Gen) | Compatible For Amazon Fire TV Stick 4K | Compatible For Amazon Fire TV Stick 4K Max streaming device | Compatible For Amazon Fire TV Stick Plus (2021) ||This is voice remote control, you need to pair it first before you use, and below is pairing steps: Press the Home button about 8-30 seconds until the LED starts to rapidly flash amber, then the remote should automatically pair with your device.|With standard navigation and playback controls, you can quickly skip to your favorite scenes.|Alexa funtion make it easily to find, launch and control all existing content you want, such as play music, view sports scores, check the weather, see live camera feeds, and control compatible smart home devices.",
//           price: 960220,
//           imageUrl: "https://m.media-amazon.com/images/I/31jcyZIAWWL._SX300_SY300_QL70_FMwebp_.jpg",
//           ratingCount: 549,
//           productRating: 4,
//           stock: 685,
//         },
//       },
//     ],
//   },
//   {
//     id: "cm9a9sc3j04h9xldnoumerxyz",
//     deliveryStatus: "PENDING",
//     totalPrice: 1526540,
//     totalProduct: 3,
//     transactionId: "cm9a9sbhg048dxldny48d9sht",
//     discountId: null,
//     createdAt: "2025-04-10T10:15:22.487Z",
//     updatedAt: "2025-04-10T10:15:22.487Z",
//     product: [
//       {
//         id: "cm9a9ruxt00nkxldno2t9qk28",
//         amount: 2,
//         price: 566320,
//         productId: "cm9a9rvdz00q3xldn1w7d6dri",
//         product: {
//           id: "cm9a9rvdz00q3xldn1w7d6dri",
//           name: "TP-Link AC600 600 Mbps WiFi Wireless Network USB Adapter for Desktop PC with 2.4GHz/5GHz High Gain Dual Band 5dBi Antenna Wi-Fi, Supports Windows 11/10/8.1/8/7/XP, Mac OS 10.15 and earlier (Archer T2U Plus)",
//           description:
//             "High-Speed Wi-Fi —— 256QAM support increases the 2.4 GHz data rate from 150 Mbps to 200 Mbps, 200 Mbps on the 2.4 GHz band and 433 Mbps on the 5 GHz band, ensure you fully enjoy fast AC Wi-Fi.|Dual Band Wireless —— 2.4 GHz and 5 GHz band provide flexible connectivity, giving your devices access to the latest dual-band Wi-Fi router for faster speed and extended range|High-Gain Antenna —— A 5dBi high-gain antenna greatly enhances the reception and transmission signal strength of the USB adapter|Supports the Latest Operating Systems —— Fully compatible with Windows 11/10/8.1/8/7/XP, Mac OS 10.15 and earlier|In an unlikely case of product quality related issue, we may ask you to reach out to brand's customer service support and seek resolution. We will require brand proof of issue to process replacement request.",
//           price: 566320,
//           imageUrl: "https://m.media-amazon.com/images/I/216Q4FqmZVL._SX300_SY300_QL70_FMwebp_.jpg",
//           ratingCount: 165,
//           productRating: 3,
//           stock: 47,
//         },
//       },
//       {
//         id: "cm9a9rxsu013gxldn9kw06jo3",
//         amount: 1,
//         price: 960220,
//         productId: "cm9a9rxsn013fxldnh9kk4fg0",
//         product: {
//           id: "cm9a9rxsn013fxldnh9kk4fg0",
//           name: "Firestick Remote",
//           description:
//             "by JBDE | Compatible For Amazon Fire TV Stick (3rd Gen, 2021) | Compatible For Amazon Fire TV Stick Lite | Compatible For Amazon Fire TV Stick (2nd Gen) | Compatible For Amazon Fire TV Stick 4K | Compatible For Amazon Fire TV Stick 4K Max streaming device | Compatible For Amazon Fire TV Stick Plus (2021) ||This is voice remote control, you need to pair it first before you use, and below is pairing steps: Press the Home button about 8-30 seconds until the LED starts to rapidly flash amber, then the remote should automatically pair with your device.|With standard navigation and playback controls, you can quickly skip to your favorite scenes.|Alexa funtion make it easily to find, launch and control all existing content you want, such as play music, view sports scores, check the weather, see live camera feeds, and control compatible smart home devices.",
//           price: 960220,
//           imageUrl: "https://m.media-amazon.com/images/I/31jcyZIAWWL._SX300_SY300_QL70_FMwebp_.jpg",
//           ratingCount: 549,
//           productRating: 4,
//           stock: 685,
//         },
//       },
//     ],
//   },
// ]

export async function loader(args: LoaderFunctionArgs) {
    const data = await fetchServer(args.request, '/api/seller/orders')

    console.log("orders"+ data);
    
    return data;
}

export default function OrdersPage() {
  const data = useLoaderData()
  return <OrderModule orders={data.orders} />
}
