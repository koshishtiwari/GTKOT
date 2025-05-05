# Momo - Minimal High-Performance E-commerce

A lightweight, high-performance e-commerce platform built with Next.js and TypeScript. This application focuses on minimal dependencies, optimized performance, and a great user experience.

## Key Features

- ⚡️ Ultra-lightweight with minimal dependencies
- 🚀 Server Components and Partial Prerendering (PPR) for optimal performance
- 🖼️ Next.js Image optimization for responsive, optimized product images
- 📱 Responsive design that works on desktop and mobile
- 🔎 Fast product search and filtering
- 🛒 Efficient shopping cart with persistence
- 💾 Direct PostgreSQL database connection
- 🔒 Secure by design

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Database**: [PostgreSQL](https://www.postgresql.org)
- **Styling**: Minimal CSS with utility classes
- **Deployment**: Docker & Docker Compose

## Project Structure

```
├── db/                   # Database scripts and migrations
│   └── schema.sql        # PostgreSQL schema with sample data
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   ├── cart/         # Cart page
│   │   ├── products/     # Product listing and detail pages
│   │   └── [...]/        # Other application routes
│   ├── components/       # React components
│   │   ├── cart/         # Cart-related components
│   │   ├── product/      # Product-related components
│   │   └── ui/           # Shared UI components
│   ├── lib/              # Shared utilities
│   │   ├── db.ts         # Database utilities
│   │   ├── products.ts   # Product utilities
│   │   └── cart.ts       # Cart utilities
│   └── types/            # TypeScript type definitions
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile            # Multi-stage production Docker build
└── next.config.js        # Next.js configuration
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) (v8 or newer)
- [Docker](https://www.docker.com/) (optional for containerized setup)

### Development Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/momo.git
cd momo
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
POSTGRES_USER=momo
POSTGRES_PASSWORD=momo_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=momo_db
```

4. Start the PostgreSQL database:

```bash
docker-compose up -d db
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Deployment

To run the application in production mode with Docker:

```bash
docker-compose up -d
```

This will build and start both the database and application containers.

## Performance Optimizations

This application implements several key performance optimizations:

1. **Server Components**: Leverages React Server Components to reduce client-side JavaScript.

2. **Partial Prerendering (PPR)**: Uses Next.js' Partial Prerendering for fast initial loading with dynamic content.

3. **Image Optimization**: Automatically optimizes images with the Next.js Image component.

4. **Code Splitting**: Automatically splits code by route for faster page loads.

5. **Database Indexing**: Optimized database queries with proper indexing.

6. **Minimal Dependencies**: Only essential packages are included to keep the bundle size small.

7. **TypeScript**: Type safety without runtime overhead.

## License

MIT
