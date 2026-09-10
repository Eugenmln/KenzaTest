# KOVA Commerce API

Spring Boot + PostgreSQL backend for the KOVA Commerce portfolio project.

## Stack
- Java 21
- Spring Boot 3.5
- Spring Web
- Spring Security
- JWT authentication
- Spring Data JPA
- PostgreSQL
- Flyway
- Bean Validation

## Local setup
1. Start PostgreSQL from the repository root:
   ```bash
   docker compose up -d postgres
   ```
2. Export the variables from `backend/.env.example` in your shell or IDE run configuration.
3. Start the API:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
4. Verify:
   `GET http://localhost:8080/api/health`

Flyway creates the complete schema automatically on first startup.

## Authentication
### Register customer
`POST /api/auth/register`

```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "phone": "+54 9 11 0000 0000"
}
```

### Login
`POST /api/auth/login`

The response contains a JWT. Protected endpoints require:

`Authorization: Bearer <token>`

If `ADMIN_EMAIL` and `ADMIN_PASSWORD` are configured, the application creates the initial admin user once.

## Public catalog
- `GET /api/products`
- `GET /api/products?category=remeras`
- `GET /api/products?q=oversize`
- `GET /api/products/{slug}`
- `GET /api/categories`

## Customer API
- `GET /api/profile`
- `PUT /api/profile`
- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/{itemId}`
- `DELETE /api/cart/{itemId}`
- `DELETE /api/cart`
- `GET /api/favorites`
- `POST /api/favorites/{productId}`
- `DELETE /api/favorites/{productId}`
- `GET /api/orders`
- `POST /api/orders`

Order creation is transactional: it validates stock, snapshots product/variant information into order items, decrements stock and clears the customer's cart.

## Admin API
Requires a JWT with role `ADMIN`.

- `POST /api/admin/products`
- `PUT /api/admin/products/{id}`
- `DELETE /api/admin/products/{id}` (soft delete via `visible=false`)
- `POST /api/admin/categories`
- `PATCH /api/admin/orders/{orderId}/status`

## Data model
- users
- categories
- products
- product_images
- product_variants
- cart_items
- favorites
- orders
- order_items

Stock is stored at variant level (`size + color`), not only at product level.
