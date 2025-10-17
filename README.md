# Lotus Product Dashboard

A modern, full-featured product management dashboard built with Next.js 15, TypeScript, and TailwindCSS. Features advanced product browsing, filtering, cart management, and analytics with a beautiful, responsive design.

## Features

### Product Management

- **Advanced Product Browsing** - Browse products with pagination and intelligent loading
- **Multi-Filter System** - Filter by categories, brands, price ranges, and stock status
- **Smart Search** - Real-time search across product titles, descriptions, and brands
- **Product Details** - Detailed product views with image galleries and specifications
- **Add New Products** - Create and add new products to the catalog

### Shopping Experience

- **Shopping Cart** - Full-featured cart with quantity management and persistent storage
- **Wishlist** - Save products for later with heart-based wishlist system
- **Stock Management** - Real-time stock tracking with low-stock and out-of-stock indicators
- **Price Calculations** - Automatic discount calculations and savings display

### Analytics & Insights

- **Brand Analytics** - Visual charts showing products distribution by brand
- **Real-time Statistics** - Live counts of total products, categories, and brands
- **Filter Analytics** - Active filter indicators and result summaries

### Modern UI/UX

- **Responsive Design** - Fully responsive across all device sizes
- **Dark Mode Ready** - Built-in dark mode support with system preference detection
- **Glass Morphism** - Modern glass-effect UI components
- **Smooth Animations** - Fluid transitions and micro-interactions
- **Accessibility** - WCAG compliant with keyboard navigation and screen reader support

### Technical Features

- **TypeScript** - Fully typed for better development experience
- **SEO Optimized** - Complete SEO setup with structured data and meta tags
- **Performance Optimized** - Image optimization, lazy loading, and efficient caching
- **Testing Suite** - Comprehensive Jest and React Testing Library setup
- **Local Storage** - Persistent cart and wishlist storage

## Tech Stack

### Frontend Framework

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development

### Styling & UI

- **TailwindCSS 4** - Utility-first CSS framework with custom design system
- **CSS Variables** - Dynamic theming support
- **Custom Components** - Reusable UI component library

### State Management

- **React Query (TanStack)** - Server state management with caching
- **React Context** - Client state management for cart and wishlist
- **React Hooks** - Custom hooks for data fetching and state logic

### Data & API

- **DummyJSON API** - External product data source
- **Local Storage** - Client-side persistence
- **Zod** - Runtime type validation and schema validation
- **React Hook Form** - Form state management and validation

### Development Tools

- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing

### Additional Libraries

- **Recharts** - Data visualization and charts
- **clsx** - Conditional className utilities
- **tailwind-merge** - TailwindCSS class merging

## Installation

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd lotus
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Navigation

- **Home Page** - Automatically redirects to products page
- **Products Page** - Main dashboard with filtering and browsing
- **Product Details** - Individual product view with full information
- **Add Product** - Form to create new products

### Product Browsing

- Use the **search bar** to find specific products
- Apply **filters** using the sidebar (categories, brands, price, stock)
- **Sort products** by price, rating, or date
- **Paginate** through results using the pagination controls

### Shopping Features

- **Add to Cart** - Click the "Add to Cart" button on product cards
- **Manage Quantities** - Use +/- buttons to adjust quantities
- **Wishlist** - Click the heart icon to save products
- **View Cart** - Click the cart icon to see your items

### Analytics

- View **product distribution charts** at the bottom of the products page
- Monitor **real-time statistics** in the hero section
- Track **active filters** and result counts

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Building

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

````

##  Design System

The project uses a custom design system with:

### Color Palette

- **Primary** - Purple gradient (#f5eaf4 to #E268D4)
- **Brand** - Magenta gradient (#d946ef to #c026d3)
- **Electric** - Green gradient (#10b981 to #059669)
- **Semantic Colors** - Success, warning, error, info variants

### Components

- **Glass morphism effects** for modern UI elements
- **Gradient backgrounds** and hover effects
- **Smooth animations** and transitions
- **Responsive grid system**
- **Custom shadows** and elevation

### Typography

- **Geist Sans** - Primary font family
- **Geist Mono** - Monospace font for code
- **Responsive sizing** with fluid typography

##  Configuration

### Environment Variables

Currently using public APIs, but you can extend with:

```env
NEXT_PUBLIC_API_URL=your-api-url
NEXT_PUBLIC_SITE_URL=your-site-url
````

### Customization

- **Colors** - Modify `tailwind.config.ts` for theme colors
- **Components** - Extend components in `components/ui/`
- **API** - Update `lib/api.ts` for different data sources
- **Styling** - Modify `app/globals.css` for global styles

## Performance

### Optimization Features

- **Image Optimization** - Next.js Image component with lazy loading
- **Code Splitting** - Automatic code splitting with Next.js
- **Caching** - React Query caching with stale-while-revalidate
- **Bundle Analysis** - Built-in bundle optimization
- **Prefetching** - Intelligent route prefetching

### Best Practices

- **TypeScript** for type safety
- **ESLint** for code quality
- **Testing** for reliability
- **Responsive design** for all devices
- **Accessibility** standards compliance

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for Accessement.

## Support

For support and questions:

- Review the documentation in this README
- Open an issue for bugs or feature requests

---

**Built with using Next.js, TypeScript, and modern web technologies.**

git init
git add README.md
git commit -m "Complete Code For Lotus Beta Analytic Assessment"
git branch -M main
git remote add origin https://github.com/Minamyle/SPA.git
git push -u origin main

**This is what I will do next with more time**

**Complete User Authentication System**
- Implement actual login/logout functionality (currently just a placeholder page)
- Add user registration and password reset
- JWT token management with refresh tokens
- Protected routes for admin features
- User roles (customer, admin, vendor)

**Full Checkout Process**
- Replace the placeholder checkout button with a complete flow
- Payment integration (Stripe, PayPal)
- Order confirmation and email receipts
- Order status tracking
- Guest checkout option

**Product Reviews & Ratings System**
- Allow users to leave reviews and ratings
- Display average ratings and review counts
- Review moderation for admins
- Photo uploads in reviews
- Helpful/not helpful voting
