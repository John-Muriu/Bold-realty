# Bold Realty – Real Estate Hub

A premium, scalable real estate web application built for **Bold Realty Kenya** to showcase luxury homes, apartments, commercial properties, and off-plan developments. The platform includes a dynamic, programmatic SEO system to automatically optimize every listing page for search engine rankings.

---

## 🚀 Core Features

- **Dynamic Programmatic SEO**:
  - Automatically generates Google-compliant JSON-LD structured schemas (`ApartmentComplex`, `House`, `CommercialProperty`, `RealEstateProject`, `BlogPosting`).
  - Renders customized meta titles, canonical links, keywords, OpenGraph tags, and Twitter Cards for every listing page.
- **Dynamic Programmatic Routing**:
  - Configured custom, human-readable SEO paths based on property type, price, and status:
    - `/off-plan/:location/:slug` (for off-plan properties)
    - `/apartments/:location/:slug` (for apartments & studios)
    - `/luxury-homes/:location/:slug` (for listings priced above KSh 50M, villas, and penthouses)
    - `/properties/:location/:slug` (default fallback path)
- **Admin Dashboard**:
  - **Dynamic Metrics**: Queries Supabase to count and display properties, blog posts, and enquiries in real-time.
  - **Auto Slug Generation**: Automatically generates URL-safe slugs from property titles in the admin form while preserving manual edits.
  - **Database Auto-Population**: Automatically populates missing slugs on old database rows using the admin's authenticated session.
- **Blog & Insights System**:
  - Implements an internal linking engine that dynamically scans blog posts and hyper-links location and property keywords (e.g., "Westlands") to corresponding property feeds.
  - Displays a **Related Listings** widget matching properties by location/type.
- **Enquiries Hub**:
  - Allows visitors to submit inquiries directly from listing pages or contact forms.
  - Features an interactive admin dashboard page for reviewing inquiries with localized contacted-status persistence.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, Lucide Icons
- **Database & Backend**: Supabase (PostgreSQL, Storage Buckets, Row Level Security, Auth Services)
- **Routing & SEO**: React Router DOM (v6), React Helmet Async, React Markdown

---

## 💻 Local Development Setup

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed.

### Step 1: Clone the Repository
```bash
git clone <your-git-url>
cd real-estate-hub
```

### Step 2: Configure Environment Variables
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_URL="https://your_project_id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_anon_key"
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Run the Development Server
```bash
npm run dev
```
The server will start locally on `http://localhost:8080`.

---

## 🗄️ Database Setup

The database schema is defined in `supabase/migrations/20251223095553_547f518e-4213-4c13-95b0-0a02d7818915.sql`. If you are setting up a new Supabase environment, run the SQL script in your Supabase SQL Editor.

### Required Storage Buckets
Create a public storage bucket named **`images`** in your Supabase dashboard to enable property image uploads. Apply a public read select policy:
```sql
CREATE POLICY "Give public access to images" ON storage.objects FOR SELECT USING ( bucket_id = 'images' );
```

---

## 📦 Production Build

To compile the application for production, execute:
```bash
npm run build
```
This generates a production-ready minified bundle inside the `dist/` directory.
