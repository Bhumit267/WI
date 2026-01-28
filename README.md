# 🛡️ OpenFare: Transparency Pattern

**"Trust, not Transactions."**

OpenFare is a government-grade **transparency and accountability platform** for intercity bus travel. Unlike booking platforms (OTAs) that focus on transactions, OpenFare exists to ensure operator promises—like cancellation policies and refund timelines—are kept.

It acts as an independent auditor layer where passengers can trace their ticket lifecycle, verify policies, and check operator reliability without the conflict of interest inherent in ticket sales.

🌐 **Live Demo:** [https://openfair.netlify.app/](https://openfair.netlify.app/)

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
- **Database**: SQLite (file-based, lightweight)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: JWT-based authentication
- **Architecture**: REST API with clear separation of concerns

---

## 🧭 Page Guide & Features

### 1. **Public Transparency Pages**
- **How It Works (`/how-it-works`)**: Visual "Trust Layer" explanation and Limitations.
- **Data Transparency (`/data-transparency`)**: Explicit policy on what data is Stored vs. Derived vs. Never Collected.
- **system Status (`/status`)**: Real-time system availability dashboard.
- **SLA & Penalties (`/sla`)**: Public rules on Refund Timelines (48h) and Trust Score deductions.

### 2. **Operator Ecosystem**
- **Partner Directory (`/operators`)**: Public list of all monitored operators with Trust Scores and Refund stats.
- **Dispute History (`/operators/[name]/disputes`)**: Read-only record of grievances and resolution times per operator.

### 3. **Passenger Tools**
- **Refund Trace (`/lookup`)**: Enter PNR and trace the exact status of your money.
- **Ticket Audit (`/tickets/[pnr]`)**: View Locked Policy, Refund Tracker, and Operator Performance.
- **User Dashboard (`/dashboard`)**: Track personal complaints and file new grievances.
- **Public Complaints (`/complaints`)**: Open ledger of recent issues.

### 4. **Governance & Regulation**
- **Regulator Dashboard (`/admin`)**: Command center for monitoring Delayed Refunds and Market Trust.
- **Audit Logs (`/admin/audit`)**: Immutable record of all sensitive admin actions (e.g., resolving complaints).
- **Complaint Management (`/admin/complaints`)**: Chat interface to directly resolve disputes with justification logging.

### 5. **Authentication (`/login`)**
Role-Based Access Control (RBAC) demonstration.
*   **Admin**: `admin@openfare.gov` / `admin123`
*   **Users**:
    - `bhumit@gmail.com` / `bhumit123`
    - `vedant@gmail.com` / `vedant123`
    - `pranathi@gmail.com` / `pranathi123`
    - `rajesh.kumar@gmail.com` / `user123`

---

## 🚀 Deployment

### One-Click Deploy to Render

1. Push your code to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) → **New +** → **Blueprint**.
3. Connect your repository. Render auto-detects `render.yaml`.
4. Click **Apply**.

> **Note:** Persistent disk (for SQLite data) requires a paid Render plan. On Free Tier, data resets on each deploy.

See [`backend/DEPLOY.md`](backend/DEPLOY.md) for detailed instructions.

---

## ⚠️ Important Note

This is a **Reference Implementation** focusing on the "Transparency Pattern".
*   The **Frontend** uses a robust Mock Data and Mock Auth implementation to demonstrate the full UX without requiring a live banking integration.
*   The **Backend** code is fully written in the `backend/` folder but is optional for the UI demonstration.

---

**© 2026 OpenFare Transparency Initiative.**