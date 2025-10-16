import React from 'react';
import { Product } from '@/types/product';

interface StructuredDataProps {
  product?: Product;
  type?: 'website' | 'product' | 'organization';
}

export function StructuredData({ product, type = 'website' }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lotus-dashboard.com';
    
    if (type === 'product' && product) {
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.title,
        "description": product.description,
        "image": product.thumbnail,
        "brand": {
          "@type": "Brand",
          "name": product.brand
        },
        "category": product.category,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "USD",
          "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "url": `${baseUrl}/products/${product.id}`
        },
        "aggregateRating": product.rating && {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "bestRating": 5,
          "worstRating": 1
        }
      };
    }

    if (type === 'organization') {
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Lotus Beta Analytics",
        "url": baseUrl,
        "description": "Professional product management dashboard for e-commerce analytics",
        "sameAs": []
      };
    }

    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Lotus Product Dashboard",
      "url": baseUrl,
      "description": "Professional product management dashboard for browsing, searching, and managing products with advanced filtering and analytics.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${baseUrl}/products?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData(), null, 2)
      }}
    />
  );
}