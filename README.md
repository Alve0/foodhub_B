# FoodHub Technical Specification Document

## 1) Authentication & Role-Based Access

**Requirement:** Users can register as either a customer or a provider. The role is selected during registration, and admin accounts are seeded in the database rather than created through the public signup flow.

**API Endpoint:**

```http
POST /api/auth/register
Body: user identity fields + password + role (customer | provider)
```

**Notes:**
Role selection is mandatory at signup. Admin creation is out of band and not part of the public registration flow.

---

**Requirement:** Users can log in with their credentials.

**API Endpoint:**

```http
POST /api/auth/login
Body: email + password
```

**Notes:**
Should return authentication state for protected customer, provider, and admin routes.

---

**Requirement:** The system can return the currently authenticated user.

**API Endpoint:**

```http
GET /api/auth/me
Headers: authentication token/session
```

**Notes:**
Used for profile hydration, route protection, and role-aware UI rendering.

---

## 2) Public Meal & Provider Browsing

**Requirement:** Visitors can browse all available meals.

**API Endpoint:**

```http
GET /api/meals
Query params: optional filters such as cuisine, dietary preference, price
```

**Notes:**
Supports the public “Browse Meals” page and filtering requirements.

---

**Requirement:** Visitors can filter meals by cuisine, dietary preferences, and price.

**API Endpoint:**

```http
GET /api/meals
Query params: cuisine, dietaryPreference, minPrice, maxPrice
```

**Notes:**
This is a filtering capability of the meal listing endpoint rather than a separate resource.

---

**Requirement:** Visitors can view meal details.

**API Endpoint:**

```http
GET /api/meals/:id
Path params: meal id
```

**Notes:**
Should return meal metadata, provider association, pricing, and availability.

---

**Requirement:** Visitors can browse providers.

**API Endpoint:**

```http
GET /api/providers
```

**Notes:**
Used for the provider listing and discovery experience.

---

**Requirement:** Visitors can view a provider profile with its menu.

**API Endpoint:**

```http
GET /api/providers/:id
Path params: provider id
```

**Notes:**
Should include provider information plus associated meals/menu items.

---

## 3) Customer Ordering Flow

**Requirement:** Customers can add meals to a cart.

**API Endpoint:**

```http
Not provided
```

**Notes:**
The requirements define cart behavior and a `/cart` page, but no cart API is listed.

---

**Requirement:** Customers can place orders with a delivery address, using Cash on Delivery.

**API Endpoint:**

```http
POST /api/orders
Body: cart/order items + delivery address + payment method (Cash on Delivery)
```

**Notes:**
This is the core checkout/order creation action. Cash on Delivery is the only payment method explicitly stated.

---

**Requirement:** Customers can track order status and view order history.

**API Endpoint:**

```http
GET /api/orders
Headers: authenticated customer
```

```http
GET /api/orders/:id
Path params: order id
Headers: authenticated customer
```

**Notes:**
`GET /api/orders` powers the “My Orders” page. `GET /api/orders/:id` powers the order details page, including status and items.

---

**Requirement:** Customers can leave reviews after ordering.

**API Endpoint:**

```http
Not provided
```

**Notes:**
The Reviews data model is defined, but no review creation endpoint exists in the supplied API list.

---

**Requirement:** Customers can manage their profile.

**API Endpoint:**

```http
GET /api/auth/me
Headers: authentication token/session
```

**Notes:**
This endpoint supports reading the current profile, but no update-profile endpoint is provided.

---

## 4) Provider Management

**Requirement:** Providers can register and log in.

**API Endpoint:**

```http
POST /api/auth/register
Body: provider registration fields + role = provider
```

```http
POST /api/auth/login
Body: email + password
```

**Notes:**
Provider registration uses the same auth flow as customers, differentiated by role.

---

**Requirement:** Providers can add menu items.

**API Endpoint:**

```http
POST /api/provider/meals
Body: meal data (name, description, price, category, availability, etc.)
```

**Notes:**
Should create a meal owned by the authenticated provider.

---

**Requirement:** Providers can edit menu items.

**API Endpoint:**

```http
PUT /api/provider/meals/:id
Path params: meal id
Body: updated meal fields
```

**Notes:**
Should only allow editing meals owned by the current provider.

---

**Requirement:** Providers can remove menu items.

**API Endpoint:**

```http
DELETE /api/provider/meals/:id
Path params: meal id
```

**Notes:**
Should only allow deletion of provider-owned meals.

---

**Requirement:** Providers can view incoming orders.

**API Endpoint:**

```http
Not provided
```

**Notes:**
The provider dashboard and orders page are specified, but no endpoint for listing provider-specific orders is included.

---

**Requirement:** Providers can update order status.

**API Endpoint:**

```http
PATCH /api/provider/orders/:id
Path params: order id
Body: status update
```

**Notes:**
Status transitions should follow the order lifecycle defined in the diagram.

---

## 5) Admin Operations

**Requirement:** Admins can view all users, including customers and providers.

**API Endpoint:**

```http
GET /api/admin/users
```

**Notes:**
Should return all non-admin and provider accounts, with role metadata.

---

**Requirement:** Admins can suspend or activate user accounts.

**API Endpoint:**

```http
PATCH /api/admin/users/:id
Path params: user id
Body: status change (active | suspended)
```

**Notes:**
This is the user moderation control described in the requirements.

---

**Requirement:** Admins can view all orders.

**API Endpoint:**

```http
Not provided
```

**Notes:**
The admin orders page is defined, but no admin order-list endpoint appears in the API list.

---

**Requirement:** Admins can manage categories.

**API Endpoint:**

```http
Not provided
```

**Notes:**
The admin categories page is defined, but no category CRUD endpoints are included.

---

## 6) Data Model / Database Tables

**Requirement:** Store user authentication and role information.

**API Endpoint:**

```http
POST /api/auth/register
GET /api/auth/me
```

**Notes:**
Backs the `Users` table. Should support customer, provider, and admin roles.

---

**Requirement:** Store provider/restaurant-specific information linked to users.

**API Endpoint:**

```http
GET /api/providers
GET /api/providers/:id
```

**Notes:**
Backs the `ProviderProfiles` table. The public provider profile endpoint implies this relation, but no write endpoint is listed.

---

**Requirement:** Store food categories such as cuisine types.

**API Endpoint:**

```http
Not provided
```

**Notes:**
Backs the `Categories` table. No category API is supplied.

---

**Requirement:** Store menu items offered by providers.

**API Endpoint:**

```http
GET /api/meals
GET /api/meals/:id
POST /api/provider/meals
PUT /api/provider/meals/:id
DELETE /api/provider/meals/:id
```

**Notes:**
Backs the `Meals` table.

---

**Requirement:** Store customer orders with items and status.

**API Endpoint:**

```http
POST /api/orders
GET /api/orders
GET /api/orders/:id
PATCH /api/provider/orders/:id
```

**Notes:**
Backs the `Orders` table and the order status workflow.

---

**Requirement:** Store customer reviews for meals.

**API Endpoint:**

```http
Not provided
```

**Notes:**
Backs the `Reviews` table. The model is specified, but the API is missing.

---

## 7) Order Status Workflow

**Requirement:** An order starts in `PLACED`, may move to `PREPARING`, then `READY`, then `DELIVERED`, or be moved to `CANCELLED`.

**API Endpoint:**

```http
PATCH /api/provider/orders/:id
Body: status transition
```

**Notes:**
The provider status-update endpoint is the only endpoint related to the lifecycle, but cancellation behavior for customers is not defined in the API list.

---

## 8) Missing Logic / Endpoints

### Requirements with no matching endpoint

- Cart management (`/cart` page exists, but no cart API is defined)
- Checkout-specific endpoint (`/checkout` page exists, but order creation is the only related API)
- Leave reviews after ordering
- Customer profile update
- Provider “view incoming orders”
- Admin “view all orders”
- Admin “manage categories”
- Category CRUD APIs
- Review CRUD APIs
- Provider profile update/create APIs
- Order cancellation endpoint, despite `CANCELLED` being in the status flow

### Endpoints with no fully explicit functional requirement

- `GET /api/auth/me` is implied by profile and session needs, but not stated as a standalone feature
- `GET /api/providers` and `GET /api/providers/:id` are implied by browsing requirements, but the specs do not separately name provider listing as a feature beyond public browsing
