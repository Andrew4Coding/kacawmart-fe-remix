"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { cn } from "~/lib/utils"
import { ProductCard } from "./product-card"
import { Pagination } from "./pagination"
import { Product } from "~/lib/types"

export function ProductsPage() {
    const [status, setStatus] = useState<string>("all")
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [error, setError] = useState<string | null>(null)
  
    // This would be replaced with actual categories from your API
    const categories = [
      { label: "All Categories", value: "" },
      { label: "CompleteTripodUnits", value: "CompleteTripodUnits" },
      // Add more categories as needed
    ]
  
    // Fetch products when filters change
    useEffect(() => {
      // Mengambil data produk dari API
      fetch("/api/product/filter")  // Sesuaikan dengan URL endpoint yang sesuai
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to fetch product data")
          }
          return res.json()
        })
        .then((data) => {
          setProducts(data.products)  // Anggap data produk ada dalam field 'products'
        })
        .catch((err) => {
          setError(err.message)
          console.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }, [])
  
    // Handle page change
    const handlePageChange = (page: number) => {
      setCurrentPage(page)
    }
  
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <div className="text-sm text-muted-foreground">Home &gt; Products</div>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <PlusCircle className="mr-2 h-4 w-4" /> ADD NEW PRODUCT
          </Button>
        </div>
  
        <div className="flex gap-4 mb-6">
          <div className="w-[200px]">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="soldout">Sold Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
  
          <div className="w-[250px]">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                  {value ? categories.find((category) => category.value === value)?.label : "Select category..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0">
                <Command>
                  <CommandInput placeholder="Search category..." />
                  <CommandList>
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category.value}
                          value={category.value}
                          onSelect={(currentValue: string) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", value === category.value ? "opacity-100" : "opacity-0")} />
                          {category.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
  
        {error && <div className="text-red-500 mb-4">{error}</div>}
  
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
  
        {!loading && products.length > 0 && (
          <div className="mt-8">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    )
  }
  