# 🛡️ OpenFare: Transparency Pattern

**"Trust, not Transactions."**

OpenFare is a government-grade **transparency and accountability platform** for intercity bus travel. Unlike booking platforms (OTAs) that focus on transactions, OpenFare exists to ensure operator promises—like cancellation policies and refund timelines—are kept.

It acts as an independent auditor layer where passengers can trace their ticket lifecycle, verify policies, and check operator reliability without the conflict of interest inherent in ticket sales.

---

## 🚀 Unique Selling Propositions (USP)

- **🚫 No Booking, Just Truth**: We do not sell tickets. This ensures our data and ratings are unbiased and purely for public interest.
- **🔒 Locked Policies**: Cancellation policies are cryptographically fixed at the time of booking. Operators cannot change terms retroactively.
- **⏱️ Refund Timeline**: A granular, auditable timeline showing exactly where a refund is stuck (Operator -> Gateway -> Bank).
- **📊 Trust Scores**: A 0-5.0 rating system driven by data (Refund Speed, Complaint Volume), not just arbitrary user stars.
- **Government-Grade Design**: A UI designed for accessibility, trust, and calmness (International Blue & Accountability Green), avoiding the "noisy" aesthetic of e-commerce.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Custom "Trust" Theme
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix Primitives)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (Subtle, professional transitions)
- **State/Auth**: React Context API (`AuthContext`)

### Backend (Separated Service)
- **Runtime**: Node.js & Express
- **Database**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/)
- **Architecture**: REST API with clear separation of concerns

---

## 🧭 Page Guide & Features

### 1. **Landing Page (`/`)**
The entry point explaining the mission.
*   **Key Features**: Hero section with "Check Your Refund" CTA, Value proposition cards (Locked Policies, Trust Scores).

### 2. **Trace Your Refund (`/lookup`)**
A clean, secure interface to track a booking.
*   **Usage**: Enter a PNR (e.g., `RB101`, `RB102`) to view its transparency audit. Includes demo quick-actions.

### 3. **Ticket Transparency (`/tickets/[pnr]`)**
The core "Audit" view.
*   **Locked Policy**: Visualizes the exact refund rules applicable to that specific ticket.
*   **Refund Tracker**: Status timeline (`Booked` -> `Cancelled` -> `Refund Initiated` -> `Settled`).
*   **Policy Violation Indicators**: Alerts user if the operator breached the timeline.

### 4. **Operator Profile (`/operators/[name]`)**
A "Credit Score" for bus operators.
*   **Trust Score**: Validated metric out of 5.0.
*   **Performance Badges**: "Fast Refund", "Verified Policy".
*   **Stats**: Average refund settlement time in hours.

### 5. **Public Complaints (`/complaints`)**
A public ledger of grievances.
*   **Transparency**: Shows recent complaints and their resolution status (`Pending`, `Resolved`, `Escalated`).

### 6. **Regulator Dashboard (`/admin`)**
**[Protected Route]** - Accessible only by Admins.
*   **Purpose**: For regulators to monitor market health.
*   **Data**: Lists "Worst Performing Operators" and aggregated delay statistics.

### 7. **Authentication (`/login`)**
Role-Based Access Control (RBAC) demonstration.
*   **Admin**: `admin@gmail.com` / `admin123`
*   **User**: `user1@gmail.com` / `user123`

---

## ⚠️ Important Note

This is a **Reference Implementation** focusing on the "Transparency Pattern".
*   The **Frontend** uses a robust Mock Data and Mock Auth implementation to demonstrate the full UX without requiring a live banking integration.
*   The **Backend** code is fully written in the `backend/` folder but is optional for the UI demonstration.

---

**© 2026 OpenFare Transparency Initiative.**