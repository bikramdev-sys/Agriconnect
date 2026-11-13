# AgriConnect — Farmer-to-Buyer Digital Agricultural Marketplace

AgriConnect is a modern, responsive digital agricultural marketplace that connects farmers directly with retailers, wholesalers, and conscious consumers. Built with a premium agricultural technology startup aesthetic, it merges modern SaaS design with organic agricultural elements, featuring 3D scenes, glassmorphism UI, real-time local state management, and comprehensive dashboards.

---

## 🌟 Key Highlights & Features

- **Hero Section with Interactive 3D Farm Scene**:
  - Two-column layout with announcement badge: *"🌱 Growing a Better Agricultural Future"*.
  - Headline: *"From Farm to Market. Freshness Without the Middlemen."*
  - Interactive 3D agricultural scene rendered with Three.js, React Three Fiber & Drei.
  - Floating produce crate with realistic carrots, tomatoes, and leafy crops.
  - Floating glassmorphism card for *"Today's Fresh Pick: Organic Tomatoes (₹35/kg)"*.
  - Mouse-responsive parallax and gentle floating leaf animations.

- **Interactive 3D Farm Experience ("Where Freshness Begins")**:
  - Full-width interactive 3D simulation featuring lush green crop rows, an animated spinning windmill, red farmhouse barn, stylized tractor, rolling hills, and floating clouds.
  - OrbitControls for smooth drag-to-orbit, zoom, and a **Reset Camera** button.
  - Graceful fallback for non-WebGL environments.

- **Marketplace & Direct Produce Catalog**:
  - Category filters: Vegetables, Fruits, Grains, Pulses, Dairy, and Certified Organic Produce.
  - Multi-parameter filtering: Price range slider (₹20 to ₹900), State/Region selector, Organic-only toggle, and In-stock status filter.
  - Sorting: Price Low-to-High, Price High-to-Low, Highest Customer Rating.
  - Real-time frontend search filtering across crops, categories, and farm locations.
  - Product cards with hover zoom, freshness indicators, farmer avatar, map pin, favorite toggle, and instant Add-to-Cart.

- **Product Details Page (`/product/:id`)**:
  - High-resolution gallery preview with multi-angle thumbnails.
  - Harvest date, shelf life, and nutritional highlights.
  - Quantity selector enforcing minimum order limits and maximum field stock caps.
  - Direct *"Contact Farmer"* modal with instant WhatsApp/SMS notification simulation.
  - Related produce recommendations.

- **Functional Shopping Cart & Checkout (`/cart`)**:
  - Incremental quantity controls with live line-item calculations.
  - Automatic delivery fee calculation (Free direct farm delivery on orders above ₹800).
  - Working promo code support (Use coupon code `FRESH20` for 15% discount).
  - Modal checkout flow with delivery address collection, payment method selection, and celebratory confetti animation.
  - Persisted in `localStorage`.

- **Farmer Dashboard (`/dashboard/farmer`)**:
  - Overview metrics: Total products listed, active crop listings, pending orders, completed orders, and total revenue.
  - Weekly sales analytics bar chart powered by Recharts.
  - Produce inventory table with image preview, live price updates, and stock tracking.
  - **Add New Harvest** modal with full validation and photo URL preview.
  - **Edit Produce** modal and **Delete Listing** confirmation dialogs.
  - Incoming purchase orders management with real-time **Accept** and **Decline** actions.

- **Platform SuperAdmin Portal (`/dashboard/admin`)**:
  - Global overview metrics: Gross Merchandise Volume (GMV), verified farmer ratio, active crop listings, zero commission policy tracking.
  - Monthly platform trade volume area chart and crop diversity bar chart (Recharts).
  - **Produce Catalog Management**: Search, filter, edit prices/inventory across all farms, toggle **Featured on Homepage (⭐)**, and toggle **"Today's Fresh Pick" (🔥)** live!
  - **Farmers Directory & KYC**: Real-time **Verify / Revoke Verification** toggle button with live badges, inspect crop specialties, or remove farm profiles.
  - **Platform Orders Oversight**: Oversee and override any order status (*Pending*, *Accepted*, *Dispatched*, *Delivered*, *Rejected*).
  - **Platform Policies & Broadcast Controls**: Live broadcast banner editor and commission rate slider (kept at 0% for direct farmer equity).

- **Buyer Dashboard (`/dashboard/buyer`)**:
  - Overview metrics: Total orders, pending orders, completed orders, and estimated middleman savings.
  - Monthly procurement spend trend area chart (Recharts).
  - Recent field orders table with live status badges (*Awaiting Farmer*, *Harvest Dispatched*, *Delivered*).
  - Quick-reorder grid for saved favorite produce.
  - Profile settings tab.

- **How It Works, Testimonials, & FAQ**:
  - 3-step visual process with connecting dashed path.
  - Interactive testimonial carousel highlighting a small vegetable farmer, grocery retail buyer, and direct customer.
  - Expandable accordion FAQ answering common trade and price autonomy questions.

---

## 🛠️ Technology Stack

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS v3 with custom forest-green palette and glassmorphism utilities
- **Routing**: React Router DOM v7
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Notifications**: React Hot Toast
- **Celebration Effects**: Canvas Confetti

---

## 🎨 Color Palette

| Name | Hex Code | Usage |
|---|---|---|
| **Primary Forest Green** | `#14532D` | Navigation, CTA buttons, dark cards, footer |
| **Secondary Fresh Green** | `#22C55E` | Badges, accents, highlights, button glows |
| **Warm Yellow** | `#FACC15` | Ratings, highlights, agricultural warmth |
| **Warm Cream** | `#FAFAF5` | Background surfaces and page body |
| **Cards & Surfaces** | `#FFFFFF` | Cards, modals, elevated surfaces |
| **Dark Green Text** | `#14251B` | Primary headings and body typography |
| **Muted Gray Green** | `#647067` | Secondary text, captions, metadata |

---

## 📂 Project Architecture

```
agriconnect/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── public/
│   └── favicon.svg              # Leaf + Location Pin SVG icon
└── src/
    ├── main.jsx                 # Entry point with React StrictMode
    ├── App.jsx                  # Router, Context Providers, Toast and Route configuration
    ├── index.css                # Tailwind directives, custom glassmorphism utilities
    ├── context/
    │   ├── AuthContext.jsx       # Auth state, login/register, demo role switcher
    │   └── CartContext.jsx       # Cart, favorites, product CRUD, orders management
    ├── data/
    │   ├── products.js           # Catalog of farm produce across 6 categories
    │   ├── farmers.js            # Farmer profiles, ratings, locations, experience
    │   ├── testimonials.js       # Customer and farmer feedback quotes
    │   └── faq.js                # FAQ accordion questions and answers
    ├── components/
    │   ├── Navbar.jsx            # Sticky glassmorphic nav with cart count and mobile drawer
    │   ├── Hero.jsx              # Two-column hero with stats and floating pick card
    │   ├── HeroScene3D.jsx       # Interactive 3D miniature farm scene (Three.js/R3F)
    │   ├── FarmExperience3D.jsx  # Dedicated 3D farm landscape with camera controls
    │   ├── ProductCard.jsx       # Product card with hover zoom, badges and Add to Cart
    │   ├── ProductGrid.jsx       # Responsive animated product card grid
    │   ├── CategoryFilter.jsx    # Category filter pills with icons
    │   ├── SearchBar.jsx         # Debounced search bar with filter toggles
    │   ├── SearchModal.jsx       # Popover quick search modal with live preview
    │   ├── HowItWorks.jsx        # 3-step direct trade guide
    │   ├── ForFarmersSection.jsx # Dedicated section targeting growers with benefits
    │   ├── AboutSection.jsx      # Mission statement, values, and impact statistics
    │   ├── Testimonials.jsx      # Interactive testimonial carousel
    │   ├── FAQ.jsx               # Accordion-based FAQ
    │   ├── Footer.jsx            # Forest green footer with newsletter subscription
    │   ├── ContactFarmerModal.jsx# Direct buyer-to-farmer inquiry modal
    │   └── ProtectedRoute.jsx    # Role-based route guard with 1-click demo switcher
    └── pages/
        ├── Home.jsx              # Landing page uniting all sections
        ├── Marketplace.jsx       # Full marketplace with multi-filter sidebar & search
        ├── ProductDetails.jsx    # Dedicated produce view with stock-capped quantity selector
        ├── Cart.jsx              # Shopping cart with coupon code & checkout flow
        ├── Login.jsx             # Split-screen login with 1-click quick demo buttons
        ├── Register.jsx          # Farmer and buyer registration with validation
        ├── BuyerDashboard.jsx    # Buyer portal with spend charts and order tracking
        ├── FarmerDashboard.jsx   # Farmer portal with inventory CRUD and order approval
        └── NotFound.jsx          # 404 error page
```

---

## 🚀 Installation & Local Setup

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed on your machine.

### 2. Install Dependencies
In the root directory of the project, run:
```bash
npm install --legacy-peer-deps
```

### 3. Run Development Server
Start the local Vite development server:
```bash
npm run dev
```
The application will be live at:
```
http://localhost:5173/
```

### 4. Build for Production
To generate production-ready static assets in the `dist/` directory:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 💡 Quick Demo Tips

1. **Instant Demo Accounts**:
   - On the **Login** page (`/login`), click **"Admin"**, **"Farmer"**, or **"Buyer"** to immediately explore the respective portal without entering credentials.
   - Admin credential hint: `admin@agriconnect.org`
   - You can also switch roles at any time using the user dropdown menu in the top-right corner of the Navigation Bar.

2. **Promo Code**:
   - In the Shopping Cart (`/cart`), apply promo code `FRESH20` to receive an instant 15% discount.

3. **Live Inventory Updates**:
   - When you place an order in the Cart, the inventory counts for those products in both the Marketplace and the Farmer Dashboard decrement in real time.
   - When a farmer accepts or rejects an order in `/dashboard/farmer`, the status updates live in the Buyer's Order list!
