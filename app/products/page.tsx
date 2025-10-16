"use client";

import { useCallback, useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useProducts, useCategories, useBrands } from "@/hooks/useProducts";
import { ProductFilters, ApiParams, ProductsResponse } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters as ProductFiltersComponent } from "@/components/products/ProductFilters";
import { SearchBar } from "@/components/products/SearchBar";
import { Pagination } from "@/components/products/Pagination";
import { ProductsByBrandChart } from "@/components/products/ProductsByBrandChart";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProductGridSkeleton } from "@/components/ui/ProductCardSkeleton";
import { CartIcon } from "@/components/cart/CartIcon";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { WishlistIcon } from "@/components/wishlist/WishlistIcon";
import { cn } from "@/lib/utils";

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Set document title
  useEffect(() => {
    document.title = "Products | Lotus Product Dashboard";
  }, []);

  // Parse URL parameters
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const brand = searchParams.get("brand") || ""; // Keep for backward compatibility
  const category = searchParams.get("category") || ""; // Keep for backward compatibility
  const brands = useMemo(
    () =>
      searchParams.get("brands")
        ? searchParams.get("brands")!.split(",").filter(Boolean)
        : [],
    [searchParams]
  );
  const categories = useMemo(
    () =>
      searchParams.get("categories")
        ? searchParams.get("categories")!.split(",").filter(Boolean)
        : [],
    [searchParams]
  );
  const priceMin = searchParams.get("priceMin")
    ? parseFloat(searchParams.get("priceMin")!)
    : undefined;
  const priceMax = searchParams.get("priceMax")
    ? parseFloat(searchParams.get("priceMax")!)
    : undefined;
  const status = searchParams.get("status") || "";
  const sort = searchParams.get("sort") || "createdAt-desc";

  const filters: ApiParams = useMemo(
    () => ({
      page: currentPage,
      limit: 10,
      search,
      brand, // Keep for backward compatibility
      category, // Keep for backward compatibility
      brands,
      categories,
      priceMin,
      priceMax,
      status: status as ProductFilters["status"],
      sort: sort as ProductFilters["sort"],
    }),
    [
      currentPage,
      search,
      brand,
      category,
      brands,
      categories,
      priceMin,
      priceMax,
      status,
      sort,
    ]
  );

  const { data, isLoading, isFetching, error, refetch } = useProducts(filters);
  const { data: availableCategories } = useCategories();
  const { data: availableBrands } = useBrands();

  // Cast data to proper type for better type safety
  const productsData = data as ProductsResponse | undefined;

  const updateUrlParams = useCallback(
    (updates: Partial<ProductFilters & { page?: number }>) => {
      const params = new URLSearchParams(searchParams);

      // Reset to page 1 when filters change
      if (Object.keys(updates).some((key) => key !== "page")) {
        params.set("page", "1");
      }

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === "" ||
          value === undefined ||
          value === null ||
          (Array.isArray(value) && value.length === 0)
        ) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, String(value));
        }
      });

      // Close mobile filters when a filter is applied (excluding page changes)
      if (Object.keys(updates).some((key) => key !== "page")) {
        setIsMobileFiltersOpen(false);
      }

      // Use replace instead of push to prevent page reloads
      router.replace(`/products?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handleProductClick = useCallback(
    (productId: number) => {
      router.push(`/products/${productId}`);
    },
    [router]
  );

  // Show skeleton on initial load for better UX
  const showSkeleton = isLoading && !productsData;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay
          message="Failed to load products. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  // Check if client-side filters are active
  const hasClientFilters = !!(
    filters.brand ||
    filters.priceMin ||
    filters.priceMax ||
    filters.status
  );

  // Use filtered total for pagination when client filters are active
  const effectiveTotal = productsData
    ? hasClientFilters && productsData.filteredTotal !== undefined
      ? productsData.filteredTotal
      : productsData.total
    : 0;
  const totalPages =
    effectiveTotal > 0 ? Math.ceil(effectiveTotal / filters.limit) : 0;
  const hasResults = productsData && productsData.products.length > 0;

  return (
    <div className="min-h-screen">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-primary-500/5 to-electric-500/5 animate-gradient"></div>

        {/* Header Icons - Positioned absolutely in top right */}
        <div className="absolute top-3 right-6 z-10 flex gap-3 bg-[#E268D4]  p-1 rounded-full shadow-lg">
          <WishlistIcon />
          <CartIcon />
        </div>

        <div className="relative container mx-auto px-4 py-12 bg-[#f5eaf4]">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-50 to-primary-50 px-4 py-2 text-[#962189] rounded-full text-sm font-medium text-brand-700 mb-6 animate-float">
              <div className="w-15 h-15 bg-gradient-to-r from-brand-500 to-primary-500 rounded-full animate-pulse  ">
                <Image
                  src="https://lotusbetaanalytics.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FlotusLogo.33d6391f.png&w=128&q=75"
                  alt="lotus logo"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              </div>
              Lotus Product Dashboard
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-brand-600 via-primary-600 to-electric-600 bg-clip-text text-transparent mb-6">
              Discover Amazing Products
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Browse through our curated collection of{" "}
              {productsData?.total || 0}+ products with advanced filtering,
              real-time search, and intelligent categorization.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card
                variant="glass"
                className="p-6 backdrop-blur-md bg-[#E268D4]"
              >
                <div className="text-2xl font-bold text-brand-600">
                  {productsData?.total || 0}+
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Products
                </div>
              </Card>
              <Card
                variant="glass"
                className="p-6 backdrop-blur-md bg-[#E268D4]"
              >
                <div className="text-2xl font-bold text-primary-600">
                  {availableCategories?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </Card>
              <Card
                variant="glass"
                className="p-6 backdrop-blur-md bg-[#E268D4]"
              >
                <div className="text-2xl font-bold text-electric-600">
                  {availableBrands?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Brands</div>
              </Card>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-8">
              <SearchBar
                value={search}
                onChange={(value) => updateUrlParams({ search: value })}
                placeholder="Search products..."
                className="h-12 rounded-xl border-0 bg-white/80 backdrop-blur-md shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 bg-[#f5eaf4]">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="w-full flex items-center justify-center gap-2"
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            {isMobileFiltersOpen ? "Hide Filters" : "Show Filters"}
            {hasClientFilters && (
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 ">
          {/* Filters Sidebar - Mobile Collapsible */}
          <aside
            className={cn(
              "lg:col-span-1",
              "lg:block", // Always show on desktop
              isMobileFiltersOpen ? "block" : "hidden" // Toggle on mobile
            )}
          >
            <Card
              variant="elevated"
              className="sticky top-8 bg-[#E268D4] lg:h-[calc(100vh-2rem)] lg:overflow-y-auto"
            >
              <CardHeader gradient>
                <CardTitle
                  gradient
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    Filters
                    {isFetching && (
                      <svg
                        className="animate-spin h-4 w-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="m 4 12 a 8 8 0 0 1 8 -8 V 0 l 4 4 -4 4 V 4 a 4 4 0 0 0 -4 4 z"
                        ></path>
                      </svg>
                    )}
                  </div>
                  {/* Mobile close button */}
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <svg
                      className="h-5 w-5"
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
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    "transition-opacity duration-200",
                    isFetching && "opacity-60"
                  )}
                >
                  <ProductFiltersComponent
                    filters={filters}
                    categories={availableCategories || []}
                    brands={availableBrands || []}
                    onFiltersChange={updateUrlParams}
                  />
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="space-y-6">
              {/* Search and Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <SearchBar
                    value={search}
                    onChange={(value) => updateUrlParams({ search: value })}
                  />
                </div>
                <Button
                  onClick={() => router.push("/products/new")}
                  className="sm:w-auto"
                >
                  Add Product
                </Button>
              </div>

              {/* Results Summary */}
              {productsData && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p>
                        Showing {(currentPage - 1) * filters.limit + 1} to{" "}
                        {Math.min(currentPage * filters.limit, effectiveTotal)}{" "}
                        of {effectiveTotal}
                        {hasClientFilters ? " filtered" : ""} products
                        {hasClientFilters &&
                          productsData.total !== effectiveTotal && (
                            <span className="text-muted-foreground/70">
                              ({productsData.total} total)
                            </span>
                          )}
                      </p>
                      {isFetching && (
                        <div className="flex items-center gap-1 text-primary">
                          <svg
                            className="animate-spin h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="m 4 12 a 8 8 0 0 1 8 -8 V 0 l 4 4 -4 4 V 4 a 4 4 0 0 0 -4 4 z"
                            ></path>
                          </svg>
                          <span className="text-xs">Updating...</span>
                        </div>
                      )}
                    </div>

                    {/* Active Filters Indicator */}
                    {hasClientFilters && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-primary">Active filters:</span>
                        {filters.brand && (
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                            Brand: {filters.brand}
                          </span>
                        )}
                        {(filters.priceMin || filters.priceMax) && (
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                            Price:{" "}
                            {filters.priceMin ? `$${filters.priceMin}` : "$0"} -{" "}
                            {filters.priceMax ? `$${filters.priceMax}` : "∞"}
                          </span>
                        )}
                        {filters.status && (
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                            Stock: {filters.status}
                          </span>
                        )}
                        <button
                          onClick={() =>
                            updateUrlParams({
                              brand: "",
                              priceMin: undefined,
                              priceMax: undefined,
                              status: undefined,
                            })
                          }
                          className="text-primary hover:text-primary/80 hover:underline transition-colors"
                        >
                          Clear filters
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="sort" className="font-medium">
                      Sort by:
                    </label>
                    <select
                      id="sort"
                      value={sort}
                      onChange={(e) =>
                        updateUrlParams({
                          sort: e.target.value as ProductFilters["sort"],
                        })
                      }
                      className="rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all duration-200 hover:border-ring/50"
                    >
                      <option value="createdAt-desc">Newest First</option>
                      <option value="createdAt-asc">Oldest First</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating-desc">Highest Rated</option>
                      <option value="rating-asc">Lowest Rated</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Products Grid */}
              {showSkeleton ? (
                <ProductGridSkeleton count={9} />
              ) : hasResults ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {productsData.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => handleProductClick(product.id)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-foreground">
                        No products found
                      </h3>
                      <p className="mt-1 text-muted-foreground">
                        Try adjusting your search or filter criteria.
                      </p>
                      <Button
                        onClick={() => updateUrlParams({})}
                        variant="outline"
                        className="mt-4"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div
                  className={cn(
                    "transition-opacity duration-200",
                    isFetching && "opacity-60"
                  )}
                >
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => updateUrlParams({ page })}
                  />
                </div>
              )}

              {/* Products by Brand Chart */}
              {hasResults && (
                <Card variant="elevated" className="bg-[#E268D4]">
                  <CardHeader gradient>
                    <CardTitle
                      gradient
                      className="flex items-center gap-2 bg-[#E268D4]"
                    >
                      <svg
                        className="h-5 w-5 text-primary "
                        fill="none"
                        stroke=""
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Products by Brand
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProductsByBrandChart products={productsData.products} />
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
