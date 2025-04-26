import { Link, useParams } from "@remix-run/react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { FileInput } from "~/components/ui/file-input";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { ProductFormValues, productSchema } from "../type";

export default function ProductUpdateModule() {
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

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    // In a real app, you would submit this data to your backend
    console.log("Form submitted:", data);
  };

  return (
    <div className="min-h-screen bg-[#f0faf5] p-20 pt-40">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Manage Product</h1>
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="min-h-[150px]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">
                              ₹
                            </span>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              className="pl-8"
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
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right column - Image upload */}
                <div>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <FileInput
                            file={form.getValues(`image`) as File | null}
                            onFileChange={(file: File) => {
                              form.setValue(`image`, file);
                            }}
                            secondaryMessage="Upload a profile photo"
                            asterisk
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex justify-end gap-4">
                <Button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  Create
                </Button>
                <Link to={`/product`}>
                  <Button
                    type="button"
                    variant="outline"
                    className="hover:bg-emerald-50 text-emerald-500"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
