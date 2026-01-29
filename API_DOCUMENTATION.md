# Khanathikana API Documentation

Complete REST API documentation with full CRUD operations for all entities.

## Base URL
```
http://localhost:8080/api
```

---

## Authentication

### Login
**POST** `/auth/login`

Login with username/password, passcode, or card ID.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123",
  "loginType": "username"
}
```

Or for passcode:
```json
{
  "passcode": "1234",
  "loginType": "passcode"
}
```

Or for card:
```json
{
  "cardId": "CARD001",
  "loginType": "card"
}
```

**Response:**
```json
{
  "token": "TOKEN_1_1234567890",
  "userId": 1,
  "username": "admin",
  "role": "ADMIN"
}
```

---

## Users (Full CRUD)

### Get All Users
**GET** `/users`

**Response:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "passcode": "1234",
    "cardId": "CARD001",
    "role": "ADMIN",
    "active": true
  }
]
```

### Get User by ID
**GET** `/users/{id}`

### Create User
**POST** `/users`

**Request Body:**
```json
{
  "username": "newuser",
  "password": "password123",
  "passcode": "5678",
  "cardId": "CARD002",
  "role": "USER",
  "active": true
}
```

### Update User
**PUT** `/users/{id}`

**Request Body:**
```json
{
  "username": "updateduser",
  "password": "newpassword",
  "passcode": "9999",
  "cardId": "CARD003",
  "role": "MANAGER",
  "active": true
}
```

### Delete User
**DELETE** `/users/{id}`

---

## Tables (Full CRUD)

### Get All Tables
**GET** `/tables`

**Response:**
```json
[
  {
    "id": 1,
    "tableNumber": "AC1",
    "section": "AC",
    "capacity": 4,
    "status": "BLANK"
  }
]
```

### Get Table by ID
**GET** `/tables/{id}`

### Get Tables by Section
**GET** `/tables/section/{section}`

Example: `/tables/section/AC`

### Create Table
**POST** `/tables`

**Request Body:**
```json
{
  "tableNumber": "AC51",
  "section": "AC",
  "capacity": 6,
  "status": "BLANK"
}
```

### Update Table
**PUT** `/tables/{id}`

**Request Body:**
```json
{
  "tableNumber": "AC51",
  "section": "AC",
  "capacity": 8,
  "status": "BLANK"
}
```

### Update Table Status Only
**PUT** `/tables/{id}/status`

**Request Body:**
```json
{
  "status": "RUNNING"
}
```

Status values: `BLANK`, `RUNNING`, `PRINTED`, `PAID`, `RUNNING_KOT`

### Delete Table
**DELETE** `/tables/{id}`

---

## Categories (Full CRUD)

### Get All Categories
**GET** `/categories`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Beverages",
    "description": "Hot and cold beverages",
    "active": true,
    "displayOrder": 1
  }
]
```

### Get Category by ID
**GET** `/categories/{id}`

### Create Category
**POST** `/categories`

**Request Body:**
```json
{
  "name": "Salads",
  "description": "Fresh salads",
  "active": true,
  "displayOrder": 11
}
```

### Update Category
**PUT** `/categories/{id}`

**Request Body:**
```json
{
  "name": "Updated Salads",
  "description": "Fresh and healthy salads",
  "active": true,
  "displayOrder": 5
}
```

### Delete Category
**DELETE** `/categories/{id}`

---

## Menu Items (Full CRUD)

### Get All Menu Items
**GET** `/menu-items`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Chaas",
    "description": "Traditional buttermilk",
    "price": 40.0,
    "category": {
      "id": 1,
      "name": "Beverages"
    },
    "available": true,
    "isFavorite": true
  }
]
```

### Get Menu Item by ID
**GET** `/menu-items/{id}`

### Get Items by Category
**GET** `/menu/items/category/{categoryId}`

### Get Favorite Items
**GET** `/menu/items/favorites`

### Create Menu Item
**POST** `/menu-items`

**Request Body:**
```json
{
  "name": "Green Salad",
  "description": "Fresh garden salad",
  "price": 120.0,
  "category": {
    "id": 1
  },
  "available": true,
  "isFavorite": false
}
```

### Update Menu Item
**PUT** `/menu-items/{id}`

**Request Body:**
```json
{
  "name": "Updated Green Salad",
  "description": "Fresh organic garden salad",
  "price": 150.0,
  "category": {
    "id": 1
  },
  "available": true,
  "isFavorite": true
}
```

### Delete Menu Item
**DELETE** `/menu-items/{id}`

---

## Menu (Read Operations)

### Get All Categories
**GET** `/menu/categories`

### Get Items by Category
**GET** `/menu/items/category/{categoryId}`

### Get Favorite Items
**GET** `/menu/items/favorites`

### Get Item by ID
**GET** `/menu/items/{id}`

---

## Orders (Full CRUD)

### Create Order
**POST** `/orders`

**Request Body:**
```json
{
  "tableId": 1,
  "userId": 1,
  "orderType": "DINE_IN",
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2,
      "notes": "Extra sugar"
    },
    {
      "menuItemId": 5,
      "quantity": 1,
      "notes": ""
    }
  ],
  "discount": 0,
  "paymentMethod": "CASH",
  "isLoyalty": false
}
```

Order Types: `DINE_IN`, `DELIVERY`, `PICK_UP`

Payment Methods: `CASH`, `CARD`, `DUO`, `OTHER`, `PART_PAYMENT`

**Response:**
```json
{
  "id": 1,
  "table": {
    "id": 1,
    "tableNumber": "AC1"
  },
  "user": {
    "id": 1,
    "username": "admin"
  },
  "orderType": "DINE_IN",
  "status": "COMPLETED",
  "subtotal": 105.0,
  "tax": 5.25,
  "discount": 0.0,
  "total": 110.25,
  "paymentMethod": "CASH",
  "isPaid": true,
  "items": [
    {
      "id": 1,
      "menuItem": {
        "id": 1,
        "name": "Chaas",
        "price": 40.0
      },
      "quantity": 2,
      "price": 40.0,
      "total": 80.0,
      "notes": "Extra sugar"
    }
  ],
  "createdAt": "2026-01-23T18:00:00"
}
```

### Get Orders by Table
**GET** `/orders/table/{tableId}`

### Get Order by ID
**GET** `/orders/{id}`

### Update Order Status
**PUT** `/orders/{id}/status`

**Request Body:**
```json
{
  "status": "PRINTED"
}
```

Status values: `PENDING`, `COMPLETED`, `PRINTED`, `KOT`, `PAID`, `CANCELLED`

---

## Database Migration

The application uses **Flyway** for database migrations. All schema changes are version-controlled.

### Migration Files Location
```
backend/src/main/resources/db/migration/
```

### Migration Files
- `V1__Create_initial_schema.sql` - Creates all tables with proper indexes
- `V2__Insert_initial_data.sql` - Inserts default users, tables, categories, and menu items

### Migration Features
- ✅ Automatic schema versioning
- ✅ Rollback support
- ✅ Database validation
- ✅ Baseline on migrate
- ✅ All changes tracked in `flyway_schema_history` table

### Configuration
```properties
spring.jpa.hibernate.ddl-auto=validate
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration
```

---

## Error Responses

All endpoints return standard error responses:

**400 Bad Request:**
```json
{
  "error": "Invalid request data"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## Testing with cURL

### Create a new table
```bash
curl -X POST http://localhost:8080/api/tables \
  -H "Content-Type: application/json" \
  -d '{
    "tableNumber": "AC51",
    "section": "AC",
    "capacity": 6,
    "status": "BLANK"
  }'
```

### Update a menu item
```bash
curl -X PUT http://localhost:8080/api/menu-items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Chaas",
    "description": "Premium buttermilk",
    "price": 50.0,
    "category": {"id": 1},
    "available": true,
    "isFavorite": true
  }'
```

### Delete a table
```bash
curl -X DELETE http://localhost:8080/api/tables/51
```

---

## Database Schema

All tables include:
- Primary key (`id`)
- Timestamps (`created_at`, `updated_at`)
- Proper indexes for performance
- Foreign key constraints
- Cascade delete where appropriate

### Tables Summary
1. **users** - User authentication and roles
2. **tables** - Restaurant tables
3. **categories** - Menu categories
4. **menu_items** - Food and beverage items
5. **orders** - Customer orders
6. **order_items** - Order line items
7. **flyway_schema_history** - Migration tracking

---

## Notes

- All data is **editable** via PUT endpoints
- All data is **saveable** to MySQL database
- All data is **accessible** via GET endpoints
- Full CRUD operations available for all entities
- Database migrations ensure schema consistency
- Proper indexing for optimal performance
