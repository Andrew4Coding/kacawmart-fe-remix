import React from "react";
import { Link } from "@remix-run/react"; // Gunakan Link dari Remix

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 min-h-screen flex flex-col justify-center items-center text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center p-8">
        <h1 className="text-5xl font-bold mb-4">Selamat Datang di Kacawmart</h1>
        <p className="text-lg mb-6">
          Solusi lengkap untuk segala kebutuhan Anda! Temukan produk berkualitas dengan harga terbaik.
        </p>
        <div className="flex space-x-4">
          <Link to="/shop">
            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full font-semibold">
              Mulai Belanja
            </button>
          </Link>
          <Link to="/categories">
            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-800 text-white py-2 px-6 rounded-full font-semibold">
              Jelajahi Kategori
            </button>
          </Link>
        </div>
      </div>

      {/* Gambar Produk */}
      <div className="w-full h-80 bg-cover bg-center mt-10" style={{ backgroundImage: 'url("/path-to-your-image.jpg")' }}></div>

      {/* Happy Customers */}
      <div className="mt-10 text-center">
        <p className="text-xl">10,000+ Pelanggan Puas</p>
        <div className="flex justify-center space-x-2 mt-4">
          {/* Add some profile pictures of happy customers */}
          <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="happy customer" className="w-12 h-12 rounded-full" />
          <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="happy customer" className="w-12 h-12 rounded-full" />
          <img src="https://randomuser.me/api/portraits/men/3.jpg" alt="happy customer" className="w-12 h-12 rounded-full" />
        </div>
      </div>

      {/* Scroll to explore */}
      <div className="mt-10">
        <p className="text-center">Scroll to explore</p>
        <div className="flex justify-center mt-4">
          <span className="text-3xl">&#8595;</span> {/* Arrow icon */}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;