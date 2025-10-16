"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  className?: string;
}

export function ProductCard({ product, onClick, className }: ProductCardProps) {
  const { addToCart, getItemQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getDiscountedPrice = (price: number, discountPercentage: number) => {
    return price * (1 - discountPercentage / 100);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return {
        label: "Out of Stock",
        color: "text-red-600",
        bgColor: "bg-red-50/90",
        borderColor: "border-red-200",
      };
    if (stock < 10)
      return {
        label: "Low Stock",
        color: "text-yellow-600",
        bgColor: "bg-amber-50/90",
        borderColor: "border-amber-200",
      };
    return {
      label: "In Stock",
      color: "text-electric-600",
      bgColor: "bg-electric-50/90",
      borderColor: "border-electric-200",
    };
  };

  const getUrgencyMessage = (stock: number) => {
    if (stock === 0) return null;
    if (stock === 1) return "Only 1 left!";
    if (stock <= 5) return `Only ${stock} left!`;
    if (stock < 10) return "Low stock";
    return null;
  };

  const stockStatus = getStockStatus(product.stock);
  const urgencyMessage = getUrgencyMessage(product.stock);
  const isDiscounted = product.discountPercentage > 0;
  const discountedPrice = isDiscounted
    ? getDiscountedPrice(product.price, product.discountPercentage)
    : product.price;
  const cartQuantity = getItemQuantity(product.id);
  const maxQuantity = Math.min(product.stock, 10); // Limit to 10 items max

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (product.stock === 0) return;

    setIsAddingToCart(true);
    try {
      addToCart(product, quantity);
      // Reset quantity after adding
      setQuantity(1);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, Math.min(newQuantity, maxQuantity)));
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    toggleWishlist(product);
  };

  return (
    <Card
      variant="elevated"
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-brand hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border-0 overflow-hidden",
        className
      )}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${product.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <CardContent className="p-0">
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square w-full overflow-hidden relative bg-gradient-to-br from-muted/20 to-muted/40">
            <Image
              src={product.thumbnail || "/placeholder-product.jpg"}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-all duration-500 group-hover:scale-110"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              onError={() => {
                // Handle error by showing fallback image
              }}
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Floating badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border transition-colors",
                  stockStatus.color === "text-green-600"
                    ? "bg-electric-50/90 text-electric-700 border-electric-200"
                    : stockStatus.color === "text-yellow-600"
                    ? "bg-amber-50/90 text-amber-700 border-amber-200"
                    : "bg-red-50/90 text-red-700 border-red-200"
                )}
              >
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    stockStatus.color === "text-green-600"
                      ? "bg-electric-500"
                      : stockStatus.color === "text-yellow-600"
                      ? "bg-amber-500"
                      : "bg-red-500"
                  )}
                />
                {stockStatus.label}
              </span>

              {/* Wishlist Heart */}
              <button
                onClick={handleWishlistToggle}
                className={cn(
                  "p-2 rounded-full backdrop-blur-sm border transition-all duration-300 hover:scale-110",
                  isInWishlist(product.id)
                    ? "bg-red-500 text-white border-red-500 shadow-lg"
                    : "bg-white/90 text-muted-foreground border-white/50 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                )}
                aria-label={
                  isInWishlist(product.id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <svg
                  className="h-4 w-4"
                  fill={isInWishlist(product.id) ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Sale badge */}
            {isDiscounted && (
              <div className="absolute top-3 right-3">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  -{Math.round(product.discountPercentage)}% OFF
                </div>
              </div>
            )}

            {/* Cart indicator */}
            {cartQuantity > 0 && (
              <div
                className="absolute top-3 right-3 z-10"
                style={{
                  transform: isDiscounted
                    ? "translateY(3rem)"
                    : "translateY(0)",
                }}
              >
                <div className="bg-electric-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  {cartQuantity} in cart
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="line-clamp-2 text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                {product.title}
              </h3>
              <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < Math.floor(product.rating)
                          ? "text-amber-400"
                          : "text-gray-300"
                      )}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating.toFixed(1)}
                </span>
              </div>
            )}

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-primary-600 bg-clip-text text-transparent">
                  {formatPrice(discountedPrice)}
                </span>
                {isDiscounted && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Urgency message */}
              {urgencyMessage && (
                <div className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-200/50">
                  <svg
                    className="h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {urgencyMessage}
                </div>
              )}

              {isDiscounted && (
                <div className="inline-flex items-center gap-1 bg-gradient-to-r from-green-50 to-emerald-50 px-2 py-1 rounded-full border border-green-200/50">
                  <svg
                    className="h-3 w-3 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs font-medium text-green-600">
                    Save {formatPrice(product.price - discountedPrice)}
                  </span>
                </div>
              )}
            </div>

            {/* Category and Brand Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                {product.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-brand-50 to-primary-50 px-2 py-1 rounded-md text-brand-700 border border-brand-200/50">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                {product.brand}
              </span>
            </div>

            {/* Add to Cart Section */}
            <div className="pt-4 border-t border-border/50 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{product.stock} in stock</span>
                <span className="text-amber-600">
                  ⭐ {product.rating.toFixed(1)}
                </span>
              </div>

              {product.stock > 0 ? (
                <div className="space-y-2">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Qty:</span>
                    <div className="flex items-center bg-muted/50 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(quantity - 1);
                        }}
                        className="px-2 py-1 hover:bg-muted transition-colors disabled:opacity-50"
                        disabled={quantity <= 1}
                      >
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                      <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(quantity + 1);
                        }}
                        className="px-2 py-1 hover:bg-muted transition-colors disabled:opacity-50"
                        disabled={quantity >= maxQuantity}
                      >
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    variant="gradient"
                    size="sm"
                    className="w-full gap-2 bg-[#E268D4]"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="opacity-25"
                          />
                          <path
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            className="opacity-75"
                          />
                        </svg>
                        Adding...
                      </>
                    ) : (
                      <>
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
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                          />
                        </svg>
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="w-full" disabled>
                  Out of Stock
                </Button>
              )}

              {/* View Details Link */}
              <button
                onClick={onClick}
                className="w-full text-xs text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 pt-1"
              >
                View Details
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
