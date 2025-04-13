import { z } from "zod"

// Update the product schema to match backend expectations
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
  price: z.number().int().min(0, "Price must be a positive number"),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
  imageUrl: z.string().url("A valid image URL is required"),
})

// Define the type based on the schema
export type ProductFormValues = z.infer<typeof productSchema>

// Update the product form schema to match what we're using in the UI
export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  categoryIds: z.string().min(1, "Category is required"), // Changed from 'category' to 'categoryIds'
  price: z.number().min(0, "Price must be a positive number"),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
  image: z.any().optional(),
})

export type ProductFormUIValues = z.infer<typeof productFormSchema>
