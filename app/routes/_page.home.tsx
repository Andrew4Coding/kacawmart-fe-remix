import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-4">Explore Our Products</h1>
      <div className="text-center mb-8">
        <Link to="/shop">
          <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full">Shop Now</button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="p-4 border rounded-lg text-center">
          <img src="product-image.jpg" alt="Product" className="w-full h-40 object-cover rounded-md" />
          <h2 className="font-semibold mt-2">Product 1</h2>
          <p className="text-sm text-gray-600">Description</p>
        </div>
        {/* Add more product cards */}
      </div>
    </div>
  );
};

export default Homepage;