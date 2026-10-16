# Furniture Store API (Express)

REST API ported from the Next.js server actions in
[`utils/actions`](https://github.com/n1j10/furniture-store/tree/main/utils/actions).

## Layers

```
routes  ->  middlewares (auth / validate / upload)  ->  controllers  ->  services  ->  models  ->  Prisma
```

- **routes** – URLs only.
- **controllers** – read `req`, call a service, send the response. No business logic.
- **services** – the logic ported from the actions (cart totals, order from cart, favorite toggle).
- **models** – every Prisma query lives here, so no controller touches the database directly.

## Setup

```bash
npm install
cp .env.example .env     # then set DATABASE_URL and JWT_SECRET
npx prisma migrate dev --name init
npm run dev
```

## Endpoints

| Method | Path | Auth | Ported from |
| --- | --- | --- | --- |
| POST | `/api/users/register` | – | (new, replaces Clerk) |
| POST | `/api/users/login` | – | (new, replaces Clerk) |
| GET | `/api/users/me` | user | `getAuthUser` |
| GET | `/api/products` | – | `fetchAllProducts` (`?search=&category=`) |
| GET | `/api/products/featured` | – | `fetchFeaturedProducts` |
| GET | `/api/products/mine` | admin | `fetchAdminPosts` |
| GET | `/api/products/:id` | – | `fetchSingleProduct` |
| POST | `/api/products` | admin | `createProductAction` (multipart, field `image`) |
| PATCH | `/api/products/:id` | admin | `updateProductAction` |
| PATCH | `/api/products/:id/image` | admin | `updateProductImageAction` |
| DELETE | `/api/products/:id` | admin | `deleteProductAction` |
| GET | `/api/cart` | user | `fetchOrCreateCart` + `updateCart` |
| GET | `/api/cart/count` | optional | `fetchCartItems` |
| POST | `/api/cart/items` | user | `addToCartAction` |
| PATCH | `/api/cart/items/:itemId` | user | `updateCartItemAction` |
| DELETE | `/api/cart/items/:itemId` | user | `removeCartItemAction` |
| POST | `/api/orders` | user | `createOrderAction` |
| POST | `/api/orders/:id/pay` | user | `payOrderAction` |
| GET | `/api/orders` | user | `fetchUserOrders` |
| GET | `/api/orders/all` | admin | `fetchAdminOrders` |
| POST | `/api/reviews` | user | `creatReviewAction` |
| GET | `/api/reviews/product/:productId` | – | `fetchProductReview` |
| GET | `/api/reviews/mine` | user | (new) |
| GET | `/api/reviews/all` | admin | `fetchAllReviews` |
| DELETE | `/api/reviews/:id` | user (own) | (new) |
| GET | `/api/favorites` | user | `fetchUserFav` |
| GET | `/api/favorites/status/:productId` | optional | `fetchFavoritID` |
| POST | `/api/favorites/toggle/:productId` | user | `toggleFavAction` |

Every response has the same shape:

```json
{ "success": true, "message": "Success", "data": {} }
```

## What changed from the Next.js version

| Next.js | Express |
| --- | --- |
| Clerk (`clerkId`, `getAuthUser`, `getAdminUser`) | local `User` model + JWT, `authenticate` / `requireAdmin` |
| Supabase storage | `multer` to disk, served from `/uploads` |
| ZainCash checkout redirect | `POST /api/orders/:id/pay` marks the order paid |
| `revalidatePath` / `redirect` | nothing – the API just returns JSON |
| `renderError` returning `{ message }` | thrown `ApiError` handled by `error.middleware.js` |
| `validateFuctionSchema` | `validate.middleware.js` (same Zod schemas) |

Author name and image are no longer sent with a review — they are read from the
logged-in user. A user can review a product once.

## Tests

```bash
npm test
```
