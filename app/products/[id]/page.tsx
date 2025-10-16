"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { useProduct } from "@/hooks/useProducts";
import { StructuredData } from "@/components/seo/StructuredData";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { notFound } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string, 10);

  const { data: product, isLoading, error, refetch } = useProduct(productId);

  // Update document title dynamically when product loads
  useEffect(() => {
    if (product) {
      document.title = `${product.title} | Lotus Product Dashboard`;
    }
  }, [product]);

  if (isNaN(productId)) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="lg" text="Loading product details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay
          title="Product Not Found"
          message="We couldn't find the product you're looking for. It may have been removed or the link might be incorrect."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return {
        label: "Out of Stock",
        color: "text-red-600",
        bgColor: "bg-red-100",
      };
    if (stock < 10)
      return {
        label: "Low Stock",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      };
    return {
      label: "In Stock",
      color: "text-green-600",
      bgColor: "bg-green-100",
    };
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="container mx-auto px-4 py-8">
      <StructuredData product={product} type="product" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4 bg-[#E268D4]">
          <Card>
            <CardContent className="p-0">
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 relative">
                <Image
                  src={product.thumbnail || "/placeholder-product.jpg"}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  priority
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 relative"
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    sizes="25vw"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6 ">
          <Card className="bg-[#E268D4]">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {product.title}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    {product.brand}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bgColor} ${stockStatus.color}`}
                >
                  {stockStatus.label}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {formatPrice(product.price)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.rating.toFixed(1)} out of 5 stars
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Category
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 capitalize">
                    {product.category}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Stock
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {product.stock} units available
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Brand
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {product.brand}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Added
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {formatDate(product.createdAt)}
                  </dd>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
