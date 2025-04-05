import { z } from "zod"
// Define the product schema with Zod
export const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
    price: z.coerce.number().positive("Price must be positive"),
    stock: z.coerce.number().int("Stock must be an integer").nonnegative("Stock cannot be negative"),
    image: z.instanceof(File).optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>
