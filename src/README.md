# CodeVector Backend Assignment

A high-performance Node.js + Express + MongoDB backend that supports browsing 200,000+ products with fast cursor-based pagination, category filtering, and consistent browsing while data changes.

---

## Features

- Cursor-based pagination (No OFFSET/LIMIT pagination)
- Stable sorting using `updated_at` + `_id`
- Category filtering
- Snapshot-based browsing consistency
- Handles 200,000+ products efficiently
- Bulk data generation using Faker
- Optimized MongoDB indexes
- REST API
- MongoDB Atlas support
- Production-ready project structure

---

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Faker.js

---

## Project Structure

```
codevector-backend
│
├── seed
│   └── seedProducts.js
│
├── src
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   └── productController.js
│   │
│   ├── models
│   │   └── Product.js
│   │
│   ├── routes
│   │   └── productRoutes.js
│   │
│   ├── utils
│   │   └── cursor.js
│   │
│   └── app.js
│
├── server.js
├── package.json
└── README.md
```

---

## Installation

```bash
git clone <repository-url>

cd codevector-backend

npm install
```

---

## Environment Variables

Create a `.env` file.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string
```

---

## Generate 200,000 Products

```bash
npm run seed
```

This command generates 200,000 random products using Faker and inserts them in batches for high performance.

---

## Run Server

```bash
npm run dev
```

---

## API Endpoints

### Health

```
GET /
```

---

### Get Products

```
GET /api/products
```

---

### Pagination

```
GET /api/products?limit=20
```

---

### Category Filter

```
GET /api/products?category=Books
```

---

### Cursor Pagination

```
GET /api/products?cursor=<nextCursor>
```

---

### Category + Cursor

```
GET /api/products?category=Books&limit=20&cursor=<nextCursor>
```

---

## Sample Response

```json
{
    "success": true,
    "count": 20,
    "hasMore": true,
    "nextCursor": "...",
    "products": []
}
```

---

## Database Indexes

```javascript
{
    updated_at: -1,
    _id: -1
}

{
    category: 1,
    updated_at: -1,
    _id: -1
}
```

These indexes make cursor pagination and category filtering efficient even with large datasets.

---

## Why Cursor Pagination?

Offset pagination becomes slower as data grows and may produce duplicate or missing records when new products are inserted or updated.

Cursor pagination solves this by:

- Fast pagination
- Stable ordering
- Better scalability
- Consistent browsing experience

---

## Data Consistency

To ensure users don't see duplicate or missing products while browsing:

- Stable sorting using `updated_at` and `_id`
- Snapshot timestamp maintained during browsing session
- Cursor stores pagination state

---

## AI Usage

AI tools (ChatGPT) were used to:

- Discuss architecture options
- Review pagination strategy
- Improve code quality
- Generate documentation

All implementation, debugging, testing, and final decisions were manually reviewed and understood before submission.

---

## Future Improvements

- Authentication
- Product search
- Redis caching
- Docker support
- API documentation with Swagger
- Unit and Integration tests

---

## Author

Rahul Tiwari