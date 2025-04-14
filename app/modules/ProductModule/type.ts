import { z } from "zod"

export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  categoryIds: z.string().min(1, "Category is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  stock: z.number().min(0, "Stock cannot be negative"),
  image: z.any().optional(),
})

export type ProductFormUIValues = z.infer<typeof productFormSchema>

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
  price: z.number().int().positive("Price must be a positive integer"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  imageUrl: z.string().url("Image URL must be valid"),
})

export const UpdateProductSchema = z.object({
  name: z.string().min(1, "Product name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  categoryIds: z.array(z.string()).min(1, "At least one category is required").optional(),
  price: z.number().int().positive("Price must be a positive integer").optional(),
  stock: z.number().int().min(0, "Stock cannot be negative").optional(),
  imageUrl: z.string().url("Image URL must be valid").optional(),
})

export type ProductData = z.infer<typeof productSchema>
