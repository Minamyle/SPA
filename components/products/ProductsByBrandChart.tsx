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
        <div className="bg-background/95 backdrop-blur-md p-4 border border-border/50 rounded-xl shadow-lg">
          <p className="font-medium text-card-foreground mb-1">{data.fullBrand}</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-brand-500 to-primary-500"></div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-card-foreground">{data.count}</span> products
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn('h-64 w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--muted-foreground))" 
            opacity={0.2}
          />
          <XAxis 
            dataKey="brand" 
            tick={{ 
              fontSize: 12, 
              fill: 'hsl(var(--muted-foreground))'
            }}
            angle={-45}
            textAnchor="end"
            height={80}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ 
              fontSize: 12, 
              fill: 'hsl(var(--muted-foreground))'
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="count" 
            fill="url(#brandGradient)"
            radius={[8, 8, 0, 0]}
            className="hover:opacity-80 transition-all duration-300"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
