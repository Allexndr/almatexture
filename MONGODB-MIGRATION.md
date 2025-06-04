# MongoDB Migration Guide

This guide explains how to migrate from PostgreSQL to MongoDB in this project.

## Prerequisites

- MongoDB Atlas account (or a local MongoDB instance)
- Connection string for your MongoDB database
- Node.js and npm installed

## Setup

1. Install MongoDB driver:

```bash
npm install mongodb
```

2. Set up environment variables:

Create or update your `.env` file with the following variables:

```
# MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=YourAppName

# MongoDB database name (optional, defaults to 'textures_app')
MONGODB_DB=textures_app
```

## Running the Migration

If you have data in PostgreSQL and want to migrate it to MongoDB:

```bash
npm run mongodb:migrate
```

This script reads data from PostgreSQL and copies it to MongoDB, preserving relationships between entities.

## Check MongoDB Connection

To verify your MongoDB connection is working:

```bash
npm run mongodb:check
```

## API Usage

The application now uses MongoDB for data storage. You can test the MongoDB integration with the example API route:

```
GET /api/mongodb-example
```

## Database Structure

MongoDB collections:

- `districts` - Geographic districts
- `textures` - Texture designs
- `tags` - Tags for textures
- `texture_tags` - Relation between textures and tags
- `products` - Products based on textures
- `product_variants` - Variants of products (size, color, etc.)
- `users` - User accounts
- `orders` - User orders
- `order_items` - Items in orders

## Helper Functions

You can use the database helper functions in `src/lib/db.js`:

```javascript
import { getTextures, getProducts, getUserByEmail } from '@/lib/db';

// Example usage
const textures = await getTextures({ limit: 10 });
const product = await getProductById(productId);
const user = await getUserByEmail('user@example.com');
```

## Troubleshooting

If you encounter connection issues:

1. Check your MongoDB connection string in the `.env` file
2. Verify network connectivity to your MongoDB instance
3. Check MongoDB Atlas IP whitelist settings
4. Run `npm run mongodb:check` to diagnose connection issues 