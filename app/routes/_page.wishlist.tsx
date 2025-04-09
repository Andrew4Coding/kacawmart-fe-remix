import React, { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { Product } from "~/modules/types/productTypes"; // Mengimpor tipe Product

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState<Product[]>([]); // Menggunakan tipe Product untuk wishlist


  useEffect(() => {
    
    fetch("/api/wishlist")
      .then((response) => response.json())
      .then((data) => setWishlist(data))
      .catch((error) => console.error("Error fetching wishlist", error));
  }, []);

  return (
    <div className="min-h-screen pt-40 p-20 space-y-10">
      <h1 className="font-libre font-bold text-2xl">Your Wishlist</h1>

      {/* Daftar produk yang ada di wishlist */}
      <div className="mt-10 grid grid-cols-4 gap-4">
        {wishlist.length === 0 ? (
          <p>Your wishlist is empty</p>
        ) : (
          wishlist.map((product) => (
            <div key={product.id} className="p-4 border rounded-lg">
              <img
                src={`/images/${product.id}.jpg`} // Ganti dengan gambar produk
                alt={product.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
              <p className="text-lg font-bold">${product.price}</p>
              <Link to={`/products/${product.id}`} className="text-blue-600 hover:underline">
                View Product
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WishlistPage;