# Deploying OpenFare to Render

This guide explains how to deploy the SQLite + Drizzle backend to [Render.com](https://render.com).

## 🚀 One-Click Deployment (Recommended)

This project includes a `render.yaml` Blueprint which automates the setup.

1.  **Push your code** to a GitHub or GitLab repository.
2.  Log in to the [Render Dashboard](https://dashboard.render.com/).
3.  Click **New +** -> **Blueprint**.
4.  Connect your repository.
5.  Render will auto-detect `render.yaml` and prompt you to apply it.
6.  Click **Apply**.

## ⚠️ Important: SQLite & Persistence

Since we are using SQLite (`openfare.db`), the database is a **file**.
- On most serverless platforms (like Render's Free Tier web services), the filesystem is **ephemeral**.
- This means **all data is deleted** every time the server restarts or deploys.

### Solution Included (`render.yaml`)
The provided `render.yaml` includes a **Persistent Disk** configuration:
```yaml
    disk:
      name: openfare-data
      mountPath: /data
      sizeGB: 1
```
This ensures your `openfare.db` survives restarts.

**Note:** Persistent Disks on Render are a paid feature. If you use the Free Tier, you must remove the `disk` section from `render.yaml`. In that case, the database will reset to the seeded state on every restart (which is fine for demos).

## ⚙️ How Verification Works

The `startCommand` is configured to ensure the database is always ready:
```bash
npm run db:push && npm run db:seed:prod && npm start
```
1.  `db:push`: Creates the SQLite file and schema if missing.
2.  `db:seed:prod`: Populates the initial deterministic mock data.
3.  `npm start`: Launches the Express server.

## 🔧 Manual Setup (If not using Blueprints)

1.  Create a **Web Service**.
2.  **Build Command**: `npm install && npm run build`
3.  **Start Command**: `npm run db:push && npm run db:seed:prod && npm start`
4.  **Environment Variables**:
    - `NODE_ENV`: `production`
    - `JWT_SECRET`: (Generate a random string)
