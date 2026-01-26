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

This project contains the following key pages and functionalities:

### 1. **Landing Page (`/`)**
The public-facing home page.
*   **Hero Section**: Explains the "Fair Refunds" mission.
*   **Call to Action**: "Check Your Refund" takes users to the lookup tool.
*   **Value Props**: Highlights "Locked Policies" and "Trust Scores".

### 2. **Trace Your Refund (`/lookup`)**
A simple, secure search interface.
*   **Functionality**: Users enter their PNR (Passenger Name Record).
*   **Demo Data**: To test, use PNRs `RB101` (Active), `RB102` (Cancelled), or `RB103` (Refunded).

### 3. **Ticket Transparency (`/tickets/[pnr]`)**
The core audit view for a specific ticket.
*   **Header**: Shows Operator Name, PNR, Status, and **Trust Score Badge** (Green for high trust, Red for low).
*   **Refund Tracker**: A vertical timeline showing every step of the refund (Booked -> Cancelled -> Initiated -> Processed).
*   **Locked Policy**: Displays the exact cancellation terms (e.g., "50% refund if cancelled 12h before") that were active at booking.
*   **Refund Details**: Shows the exact amount refundable and the deadline for the operator to pay.

### 4. **Operator Profile (`/operators/[name]`)**
A public profile for each bus operator (e.g., Kaveri Travels).
*   **Trust Score**: An aggregate rating (0-5.0) based on their refund speed and policy adherence.
*   **Badges**: Awards like "Fast Refund" or "Verified Policy".
*   **Stats**: Average Refund Time (hours) and Complaint Count.

### 5. **Public Complaints (`/complaints`)**
A transparency log of all recent grievance filings.
*   **List View**: Shows recent complaints against operators.
*   **Status Tags**: `Resolved`, `Escalated`, `Pending`.
*   **Purpose**: Creates public pressure on operators to resolve issues.

### 6. **User Dashboard (`/dashboard`)**
**[Requires Login]** - The personal area for passengers.
*   **My Complaints**: A list of grievances filed by the logged-in user.
*   **New Complaint (`/dashboard/new`)**: A form to submit a new issue (PNR, Reason, Description).

### 7. **Regulator Dashboard (`/admin`)**
**[Requires Login]** - The command center for government regulators.
*   **Overview**: Key metrics like "Delayed Refunds" (Violating 48h SLA) and "Market Trust".
*   **Worst Performers**: A table listing operators with the highest failure rates.
*   **Complaints Management (`/admin/complaints`)**:
    *   **List**: All open complaints from all users.
    *   **Detail View (`/admin/complaints/[id]`)**: A chat interface where Admins can DM users directly to resolve disputes.

### 8. **Authentication (`/login`)**
Demonstration of Role-Based Access Control (RBAC).
*   **Admin Access**: Email: `admin@gmail.com` | Pass: `admin123` -> Redirects to `/admin`.
*   **User Access**: Email: `user1@gmail.com` | Pass: `user123` -> Redirects to `/dashboard`.

---

## ⚠️ Important Note

This is a **Reference Implementation** focusing on the "Transparency Pattern".
*   The **Frontend** uses a robust Mock Data and Mock Auth implementation to demonstrate the full UX without requiring a live banking integration.
*   The **Backend** code is fully written in the `backend/` folder (Schema & Seed) but the frontend runs independently for demonstration purposes.

---

**© 2026 OpenFare Transparency Initiative.**