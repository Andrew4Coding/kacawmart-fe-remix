import { Link, useParams } from "@remix-run/react";

export default function ProductDetailModule() {
    const { id } = useParams();
    const product = {
        id,
        name: "Sample Product",
        description: "This is a sample product description.",
        category: "Sneaker",
        price: 110.4,
        stock: 211,
        images: [
            "https://i.pravatar.cc/300",
            "https://i.pravatar.cc/301",
            "https://i.pravatar.cc/302",
            "https://i.pravatar.cc/303",
        ],
    };

    return (
        <div className="min-h-screen bg-[#f0faf5] p-20 pt-40">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Product Details</h1>
                    <div className="text-gray-600">
                        <Link to="/" className="hover:underline">
                            Home
                        </Link>{" "}
                        {" > "}
                        <Link to="/products" className="hover:underline">
                            All Products
                        </Link>{" "}
                        {" > "}
                        <span>Product Details</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold">Product Name</h2>
                                <p className="text-gray-700">{product.name}</p>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold">Description</h2>
                                <p className="text-gray-700">{product.description}</p>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold">Category</h2>
                                <p className="text-gray-700">{product.category}</p>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold">Price</h2>
                                <p className="text-gray-700">₹{product.price.toFixed(2)}</p>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold">Stock Quantity</h2>
                                <p className="text-gray-700">{product.stock}</p>
                            </div>
                        </div>

                        {/* Right column - Images */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Product Images</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Product Image ${index + 1}`}
                                        className="rounded-lg shadow"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-8 flex justify-end">
                        <Link to="/products">
                            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded">
                                Back to Products
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
