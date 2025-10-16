'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductsByBrandChartProps {
  products: Product[];
  className?: string;
}

interface ChartDataItem {
  brand: string;
  count: number;
  fullBrand: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataItem;
    value: number;
  }>;
  label?: string;
}

export function ProductsByBrandChart({ products, className }: ProductsByBrandChartProps) {
  const chartData = React.useMemo(() => {
    const brandCounts = products.reduce((acc, product) => {
      acc[product.brand] = (acc[product.brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(brandCounts)
      .map(([brand, count]) => ({
        brand: brand.length > 15 ? `${brand.substring(0, 15)}...` : brand,
        count,
        fullBrand: brand,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Show top 10 brands
  }, [products]);

  if (chartData.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-64 text-gray-500 dark:text-gray-400', className)}>
        <p>No data available for chart</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100">{data.fullBrand}</p>
          <p className="text-blue-600 dark:text-blue-400">
            Products: <span className="font-semibold">{data.count}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn('h-64 w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="brand" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="count" 
            fill="#3B82F6"
            radius={[2, 2, 0, 0]}
            className="hover:opacity-80 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
