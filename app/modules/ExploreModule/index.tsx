import { useState, useEffect } from "react"
import { ArrowRight, Star, Filter, Search, ChevronDown } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Badge } from "~/components/ui/badge"
import { Card, CardContent, CardFooter } from "~/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { Link } from "@remix-run/react"

interface Category {
  id: string
  name: string
  productCount: number
}

interface Seller {
  id: string
  bankName: string
  bankNumber: string
  shopRating: number
  selledProduct: number
  userId: string
  createdAt: string
  updatedAt: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  ratingCount: number
  productRating: number
  stock: number
  category: Category[]
  Seller: Seller[]
}

interface ExploreResponse {
  products: Product[]
  categories?: Category[]
}

// Format price to IDR
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function ExplorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<string>("default")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/explore")

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data: ExploreResponse = await response.json()
      setProducts(data.products)
      setError(null)
    } catch (err) {
      setError("Failed to load products. Please try again later.")
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories from products
  const categories = products.reduce((acc: Category[], product) => {
    product.category.forEach((cat) => {
      if (!acc.some((c) => c.id === cat.id)) {
        acc.push(cat)
      }
    })
    return acc
  }, [])

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === null || product.category.some((cat) => cat.id === selectedCategory)

    return matchesSearch && matchesCategory
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.productRating - a.productRating
      default:
        return 0
    }
  })

  return (
    <main className="w-full font-sans">
      {/* Header Section */}
      <section className="relative bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 pt-16 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className={`space-y-6 max-w-4xl mx-auto text-center ${isVisible ? "animate-fadeIn" : "opacity-0"}`}>
            <Badge className="px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
              Explore Products
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 font-serif">
              Discover Our <span className="text-emerald-600">Collection</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through our extensive catalog of high-quality products at competitive prices.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-auto flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 py-2 border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-gray-200">
                    <Filter className="h-4 w-4 mr-2" />
                    Category
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => setSelectedCategory(null)}
                    className={selectedCategory === null ? "bg-emerald-50 text-emerald-600" : ""}
                  >
                    All Categories
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={selectedCategory === category.id ? "bg-emerald-50 text-emerald-600" : ""}
                    >
                      {category.name} ({category.productCount})
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-gray-200">
                    Sort By
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => setSortOption("default")}
                    className={sortOption === "default" ? "bg-emerald-50 text-emerald-600" : ""}
                  >
                    Default
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortOption("price-low")}
                    className={sortOption === "price-low" ? "bg-emerald-50 text-emerald-600" : ""}
                  >
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortOption("price-high")}
                    className={sortOption === "price-high" ? "bg-emerald-50 text-emerald-600" : ""}
                  >
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortOption("rating")}
                    className={sortOption === "rating" ? "bg-emerald-50 text-emerald-600" : ""}
                  >
                    Highest Rated
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          {error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4 text-lg">{error}</div>
              <Button onClick={fetchProducts} className="bg-emerald-600 hover:bg-emerald-700">
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {loading
                    ? "Loading products..."
                    : `${sortedProducts.length} Products ${selectedCategory ? `in ${categories.find((c) => c.id === selectedCategory)?.name}` : ""}`}
                </h2>
                {!loading && sortedProducts.length > 0 && (
                  <p className="text-sm text-gray-500">
                    Showing {sortedProducts.length} of {products.length} products
                  </p>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  <p className="ml-4 text-lg text-gray-600">Loading products...</p>
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-500 mb-4">No products found matching your criteria.</div>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory(null)
                      setSortOption("default")
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}

          {!loading && sortedProducts.length > 0 && (
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-lg"
              >
                Load More <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-serif">Can't Find What You're Looking For?</h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Browse our categories or use the search feature to find the perfect product for you.
          </p>
          <Button className="bg-white text-emerald-700 hover:bg-gray-100 px-6 py-3 rounded-lg">Contact Support</Button>
        </div>
      </section>
    </main>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link to={`explore/product/${product.id}`} className="block">
      <Card
        className="overflow-hidden transition-all duration-300 hover:shadow-md group h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden pt-[100%]">
          <img
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
          />
          {product.stock < 100 && (
            <Badge className="absolute top-3 left-3 bg-amber-500 text-white hover:bg-amber-600">Low Stock</Badge>
          )}
          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            <Button className="bg-white text-emerald-700 hover:bg-gray-100">View Details</Button>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <Star
                className={`h-4 w-4 ${product.productRating >= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
              />
              <span className="text-sm font-medium ml-1">{product.productRating}</span>
            </div>
            <span className="text-xs text-gray-500 ml-2">({product.ratingCount} reviews)</span>
            {product.category.length > 0 && (
              <Badge variant="outline" className="ml-auto text-xs border-gray-200 text-gray-600">
                {product.category[0].name}
              </Badge>
            )}
          </div>
          <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 h-12">
            {product.name.replace(/!!/g, "")}
          </h3>
          <div className="mt-2 text-lg font-bold text-emerald-600">{formatPrice(product.price)}</div>
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">View Product</Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
