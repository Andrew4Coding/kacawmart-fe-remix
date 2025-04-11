import { Link } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import fetchServer from "~/lib/fetch";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { FileInput } from "~/components/ui/file-input";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { ProductFormValues, productSchema } from "../type";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"

type Category = {
    id: string;
    name: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
    try {
        const data = await fetchServer(request, "/api/product/categories");
        console.log("Raw categories data:", data);
        
        // Assume the response is directly the array of categories
        return { categories: data };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { categories: [] };
    }
}

export default function ProductCreateModule() {
    const data = useLoaderData<typeof loader>();
    
    // Log the data to verify its structure
    console.log("Loader data:", data);

    const categories: Category[] = data || [];

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            category: categories.length > 0 ? categories[0].id : "",
            price: 0,
            stock: 0,
            image: null
        },
    });

    const onSubmit = (data: ProductFormValues) => {
        console.log("Form submitted:", data)
    }

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
                    <FormProvider {...form}>
                        <form 
                            onSubmit={form.handleSubmit(onSubmit)}
                            method="post"
                            encType="multipart/form-data"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Insert your product name here..."/>
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
                                                    <Textarea {...field} className="min-h-[150px]" placeholder="Tell customers what makes this product special..."/>
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
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                <SelectTrigger className="h-10">
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                {categories.length === 0 ? (
                                                    <SelectItem value="uncategorized">
                                                        Uncategorized
                                                    </SelectItem>
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
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                                                        <Input 
                                                            {...field} 
                                                            type="number" 
                                                            step="0.01" 
                                                            className="pl-8" 
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                                                <FormLabel>Stock Quantity</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        {...field} 
                                                        type="number" 
                                                        placeholder="How many items are available?"
                                                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                                    />
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
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product Image</FormLabel>
                                                <FormControl>
                                                    <FileInput
                                                        file={form.getValues("image") as File | null}
                                                        onFileChange={(file: File) => {
                                                            form.setValue("image", file);
                                                        }}
                                                        secondaryMessage="Upload a product image"
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
                                <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                                    Create
                                </Button>
                                <Link to={`/product`}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    )
}