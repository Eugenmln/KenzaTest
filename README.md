# KOVA Commerce

Full-stack portfolio project for a fictional fashion brand.

The project is being evolved from an initial storefront prototype into a production-style commerce application with a custom Java backend, authentication, variant-level stock, persistent carts, favorites, orders and an admin API.

## Target stack
- React 19 + Vite
- Java 21 + Spring Boot 3.5
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Flyway migrations
- WhatsApp checkout handoff
- Docker Compose for local PostgreSQL

## Backend
The custom backend lives in `backend/` and is now the canonical transactional architecture for the portfolio version.

It includes:
- customer registration and login
- BCrypt password hashing
- JWT authentication
- CUSTOMER and ADMIN roles
- customer profile endpoints
- public catalog API
- category management
- product CRUD
- product variants by size/color
- variant-level stock
- authenticated cart
- favorites
- order creation and history
- admin order listing and status updates
- transactional checkout with stock validation
- pessimistic variant locking during checkout to reduce overselling races
- PostgreSQL schema managed by Flyway
- API validation and error responses
- configurable CORS
- optional initial admin bootstrap from environment variables

## API structure

```text
backend/
  src/main/java/com/kova/backend/
    auth/
    cart/
    catalog/
    common/
    config/
    favorite/
    order/
    security/
    user/
  src/main/resources/
    db/migration/
    application.yml
```

See `backend/README.md` for endpoints and setup.

## Frontend
The React storefront currently contains the previous prototype integrations while the new Spring API is developed. The next integration pass will migrate authentication, catalog, cart, favorites and orders to the custom backend and remove the obsolete Supabase/Sanity transactional path.

Visual polishing is intentionally being handled separately from backend work.

## Run PostgreSQL

```bash
docker compose up -d postgres
```

## Run backend

```bash
cd backend
mvn spring-boot:run
```

Default local API:

```text
http://localhost:8080
```

Health endpoint:

```text
GET /api/health
```

## Main endpoints

### Public
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/{slug}`
- `GET /api/categories`

### Customer
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

### Admin
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/{id}`
- `DELETE /api/admin/products/{id}`
- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/{id}`
- `DELETE /api/admin/categories/{id}`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/{orderId}/status`

## Status
Active development on `feature/kova-commerce-foundation`.

The backend foundation is implemented. The next functional phase is wiring the React application to the Spring API, followed by visual refinement and deployment.
