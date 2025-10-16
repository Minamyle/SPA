"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/Button";

export function CartSidebar() {
  const {
    isOpen,
    closeCart,
    items,
    itemCount,
    totalAmount,
    subtotal,
    savings,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 transform transition-transform duration-300 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b border-border/50 p-6 bg-gradient-to-r from-brand-50/50 to-primary-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-primary-600 bg-clip-text text-transparent">
                Shopping Cart
              </h2>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Close cart"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                  <svg
                    className="h-12 w-12 text-muted-foreground"
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
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Add some products to get started!
                  </p>
                </div>
                <Button onClick={closeCart} variant="primary">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const discountedPrice =
                    item.product.discountPercentage > 0
                      ? item.product.price *
                        (1 - item.product.discountPercentage / 100)
                      : item.product.price;

                  return (
                    <div
                      key={item.product.id}
                      className="bg-card border border-border/50 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex gap-3">
                        <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={
                              item.product.thumbnail ||
                              "/placeholder-product.jpg"
                            }
                            alt={item.product.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-card-foreground line-clamp-2 text-sm">
                            {item.product.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.product.brand} • {item.product.category}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <span className="font-bold text-brand-600">
                              {formatPrice(discountedPrice)}
                            </span>
                            {item.product.discountPercentage > 0 && (
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(item.product.price)}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Qty:
                          </span>
                          <div className="flex items-center bg-muted/50 rounded-md overflow-hidden">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              className="px-2 py-1 hover:bg-muted transition-colors text-sm"
                              disabled={item.quantity <= 1}
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
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              className="px-2 py-1 hover:bg-muted transition-colors text-sm"
                              disabled={item.quantity >= item.product.stock}
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

                        <div className="text-right">
                          <div className="font-bold text-card-foreground">
                            {formatPrice(discountedPrice * item.quantity)}
                          </div>
                          {item.product.discountPercentage > 0 && (
                            <div className="text-xs text-muted-foreground line-through">
                              {formatPrice(item.product.price * item.quantity)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with Totals and Checkout */}
          {items.length > 0 && (
            <div className="border-t border-border/50 p-6 bg-gradient-to-r from-muted/20 to-background">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Savings:</span>
                    <span className="font-medium text-green-600">
                      -{formatPrice(savings)}
                    </span>
                  </div>
                )}

                <div className="border-t border-border/50 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="bg-gradient-to-r from-brand-600 to-primary-600 bg-clip-text text-transparent">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-3">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      // Handle checkout
                      alert(
                        "Checkout functionality would be implemented here!"
                      );
                    }}
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Secure Checkout
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={closeCart}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
