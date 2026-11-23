# BookNook – A Small Online Library

A modern, full-stack online library management application where readers can discover books, share titles with the community, borrow available copies, and manage their personal reading activity.

---

## 🔗 Project Links

- **Live Site URL:** [https://booknook-client.vercel.app](https://booknook-client.vercel.app) *(or your deployed production URL)*
- **Client Repository:** [https://github.com/nayemhasan892008/BookNook](https://github.com/nayemhasan892008/BookNook)
- **Backend API Repository:** [https://github.com/nayemhasan892008/BookNook/tree/main/booknook-server](https://github.com/nayemhasan892008/BookNook/tree/main/booknook-server)

---

## ✨ Key Features

1. **Authentication with BetterAuth & JWT:**
   - Secure email/password registration and login alongside Google OAuth integration.
   - JWT token generation, persistent session cookies, and automatic route protection via proxy middleware to prevent unauthenticated access.
   - Reload persistence ensuring signed-in users are never unexpectedly redirected on page refresh.

2. **Browse, Search & Category Filter:**
   - Explore library shelves with real-time text search across titles and authors.
   - Filter books by standard categories (*Fiction*, *Science*, *History*, *Kids*, *Others*).
   - Responsive book cards with cover image previews, author details, and availability badges.

3. **Add Books with Live Cover Preview:**
   - Dedicated page allowing authenticated readers to contribute new titles to BookNook.
   - Live cover image preview with URL validation and fallback graphics.
   - Integer copy quantity validation ensuring accurate library inventory.

4. **Manage My Books (Read, Update & Delete):**
   - Personal dashboard at `/my-books` showing only books added by the logged-in reader in a responsive table and mobile-friendly equal-height cards.
   - Pre-filled modal to update book details (title, author, category, image URL, description, total copies).
   - Backend-validated copy constraints preventing reduction of total copies below currently borrowed copies.
   - Custom confirmation modal before deletion, strictly prohibiting removal of books with active loans (`409 Conflict`).

5. **Borrow & Return System with Double-Borrow Prevention:**
   - Interactive book details page with real-time availability tracking (`availableCopies / totalCopies`).
   - Ownership guard preventing users from borrowing their own books (`403 Forbidden`).
   - Active loan verification preventing double-borrowing of the same title (`409 Conflict`).
   - Borrow modal capturing user details and return date (must be today or future date).
   - `/my-borrows` dashboard tracking all active borrows with return dates, overdue indicators, and one-click book returns with immediate inventory re-increment.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, Turbopack, React 19)
- **Styling:** Tailwind CSS & Lucide React icons
- **UI Components:** shadcn/ui (Dialog, AlertDialog, Table, Card, Button, Input, Select, Badge)
- **Notifications:** Sonner toasts
- **Authentication:** BetterAuth with MongoDB adapter & JWT plugin
- **Backend:** Node.js, Express, MongoDB Native Driver, JOSE (JWKS verification)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18.17+ or v20+)
- MongoDB Atlas cluster or local MongoDB instance

### 2. Environment Variables
Create a `.env` file in the root directory:

```env
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
MONGO_DB_URL=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Installation & Run
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📄 License
This project is open-source under the MIT License.
