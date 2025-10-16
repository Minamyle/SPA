"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddProduct, useCategories, useBrands } from "@/hooks/useProducts";
import { addProductSchema, AddProductFormData } from "@/lib/schemas";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { FileUpload } from "@/components/ui/FileUpload";

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Set document title
  useEffect(() => {
    document.title = "Add New Product | Lotus Product Dashboard";
  }, []);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: brands, isLoading: brandsLoading } = useBrands();
  const addProductMutation = useAddProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
  });

  const onSubmit = async (data: AddProductFormData) => {
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      await addProductMutation.mutateAsync(data);
      setSubmitSuccess(true);
      reset();

      // Auto-redirect after success
      setTimeout(() => {
        router.push("/products");
      }, 2000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to add product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = categoriesLoading || brandsLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="lg" text="Loading form data..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#E268D4]">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-[#E268D4]"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </Button>
      </div>

      <div className="max-w-2xl mx-auto bg-[#f5eaf4] p-6 rounded-lg shadow">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Add New Product
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Fill in the details below to add a new product to the catalog
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            {submitSuccess && (
              <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Product added successfully! Redirecting to products
                      list...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {submitError && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {submitError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <Input
                    label="Product Title"
                    {...register("title")}
                    error={errors.title?.message}
                    placeholder="Enter product title"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Brand */}
                <div>
                  <Select
                    label="Brand"
                    {...register("brand")}
                    error={errors.brand?.message}
                    disabled={isSubmitting || brandsLoading}
                    required
                    placeholder={
                      brandsLoading ? "Loading brands..." : "Select a brand"
                    }
                    options={
                      brands
                        ?.filter((brand) => typeof brand === "string")
                        .map((brand) => ({
                          value: brand,
                          label: brand,
                        })) || []
                    }
                  />
                </div>

                {/* Category */}
                <div>
                  <Select
                    label="Category"
                    {...register("category")}
                    error={errors.category?.message}
                    disabled={isSubmitting || categoriesLoading}
                    required
                    placeholder={
                      categoriesLoading
                        ? "Loading categories..."
                        : "Select a category"
                    }
                    options={
                      categories
                        ?.filter((category) => typeof category === "string")
                        .map((category) => ({
                          value: category,
                          label: category
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" "),
                        })) || []
                    }
                  />
                </div>

                {/* Price */}
                <div>
                  <Input
                    label="Price"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("price", { valueAsNumber: true })}
                    error={errors.price?.message}
                    placeholder="0.00"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Stock */}
                <div>
                  <Input
                    label="Stock Quantity"
                    type="number"
                    min="0"
                    {...register("stock", { valueAsNumber: true })}
                    error={errors.stock?.message}
                    placeholder="0"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  {...register("description")}
                  rows={4}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter product description"
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <FileUpload
                  label="Product Thumbnail"
                  helperText="Upload a main product image"
                  onFilesChange={(files) =>
                    setValue("thumbnail", files[0] || "")
                  }
                  value={watch("thumbnail") ? [watch("thumbnail")] : []}
                  disabled={isSubmitting}
                  multiple={false}
                  maxSize={5}
                />

                <FileUpload
                  label="Additional Images"
                  helperText="Upload additional product images (optional)"
                  onFilesChange={(files) => setValue("images", files)}
                  value={watch("images") || []}
                  disabled={isSubmitting}
                  multiple={true}
                  maxSize={5}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-[#E268D4]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting || submitSuccess}
                  className="w-full sm:w-auto bg-[#E268D4]"
                >
                  {isSubmitting ? "Adding Product..." : "Add Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
