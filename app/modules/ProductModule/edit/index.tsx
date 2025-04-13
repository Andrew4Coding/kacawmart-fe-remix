"use client"

import type React from "react"

import { Link, useSubmit } from "@remix-run/react"
import { Save, Camera } from "lucide-react"
import { useState, useRef } from "react"
import { toast } from "~/components/ui/use-toast"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider as RHFFormProvider } from "react-hook-form"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

import { type ProductFormUIValues, productFormSchema } from "../type"
import { uploadImage } from "~/lib/upload-image"

type Category = {
  id: string
  name: string
}

interface ProductEditModuleProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    stock: number
    imageUrl: string
    category?: {
      id: string
      name: string
    }
  }
  categories: Category[]
}

export default function ProductEditModule({ product, categories = [] }: ProductEditModuleProps) {
  // State for product image
  const [productImage, setProductImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(product.imageUrl || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const submit = useSubmit()

  // Update the form default values to use categoryIds instead of category
  const form = useForm<ProductFormUIValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      categoryIds: product.category?.id || (categories.length > 0 ? categories[0].id : ""), // Changed from 'category' to 'categoryIds'
      price: product.price / 100, // Convert from cents to dollars for display
      stock: product.stock,
      image: null,
    },
  })

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        })
        return
      }

      setProductImage(file)

      // Update form value
      form.setValue("image", file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Update the onSubmit function to use categoryIds
  const onSubmit = async (data: ProductFormUIValues) => {
    try {
      setIsSubmitting(true)

      // Prepare the data for the backend
      let imageUrl = product.imageUrl

      // If a new image was uploaded, process it
      if (productImage) {
        imageUrl = await uploadImage(productImage)
      }

      const productData = {
        name: data.name,
        description: data.description,
        categoryIds: [data.categoryIds], // Convert single categoryIds to array
        price: Math.round(data.price * 100), // Convert to cents
        stock: data.stock,
        imageUrl: imageUrl,
      }

      // Submit the data
      submit(productData, { method: "post", encType: "application/json" })
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f0faf5] p-6 md:p-10 lg:p-20 pt-40">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Product</h1>
          <div className="text-gray-600">
            <Link to="/" className="hover:underline">
              Home
            </Link>{" "}
            {" > "}
            <Link to="/products" className="hover:underline">
              All Products
            </Link>{" "}
            {" > "}
            <span>Edit Product</span>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-b">
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <RHFFormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left column - Main product info */}
                  <div className="lg:col-span-2 space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Product Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter product name" className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="min-h-[180px] resize-none"
                              placeholder="Describe your product in detail..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoryIds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.length === 0 ? (
                                <SelectItem value="uncategorized">Uncategorized</SelectItem>
                              ) : (
                                categories.map((cat) => (
                                  <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                className="pl-8 h-11"
                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                placeholder="0.00"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Stock Quantity</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              className="h-11"
                              placeholder="Enter available quantity"
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Right column - Image upload */}
                  <div className="lg:col-span-1">
                    <FormLabel className="text-base font-medium block mb-2">Product Image</FormLabel>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                      <div className="relative">
                        {imagePreview ? (
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Product preview"
                            className="w-full h-64 object-cover"
                          />
                        ) : (
                          <div className="w-full h-64 bg-gray-50 flex flex-col items-center justify-center p-6">
                            <div className="text-gray-400 mb-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-500 text-center">Upload a product image</p>
                          </div>
                        )}

                        {/* Upload button */}
                        <button
                          type="button"
                          onClick={handleUploadClick}
                          className="absolute bottom-4 right-4 bg-emerald-600 text-white p-2 rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
                        >
                          <Camera className="h-4 w-4" />
                        </button>

                        {/* Hidden file input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: 1200 x 1200px. Max size: 5MB. Formats: JPG, PNG, GIF
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Link to="/products">
                    <Button type="button" variant="outline" className="px-6">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 px-6" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </RHFFormProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
