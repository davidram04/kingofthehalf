# kingofthehalf.com - Competition Tracker

This is the full-stack web application for **kingofthehalf.com**, built to manage token-elimination competitions.

## Key Features

1. **User Registration**:
   - Every registered user is assigned a unique Player ID (e.g., `KOTH-A1B2C3`).
   - Every player starts with **1 token**.
   - Accepts a color profile photo upload.

2. **Match Execution & Rules**:
   - Admin/Referee records matches between 2 competitors.
   - When Player A beats Player B:
     - All of Player B's accumulated tokens are transferred to Player A.
     - Player A receives +1 to their Win count.
     - Player B is eliminated (tokens set to 0, +1 Loss) and their profile photo dynamically switches to **Black & White** using CSS grayscale filters.

3. **Leaderboard & Filtering**:
   - Filter rankings by **State** (e.g., FL, CA).
   - Sort by **Total Wins**, **Win Percentage (%)**, or **Token Count**.

---

## Local Quickstart Instructions

### Prerequisites
- Node.js (v16 or higher) installed.

### Steps
1. Unzip the project folder and navigate into it:
   ```bash
   cd kingofthehalf
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```
4. Open your browser and visit:
   - **Public Leaderboard**: [http://localhost:3000](http://localhost:3000)
   - **Register Competitors**: [http://localhost:3000/register](http://localhost:3000/register)
   - **Admin Match Recording**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Deploying to AWS (Option 1 - AWS App Runner)

1. Push this project code to a GitHub repository.
2. Log into the **AWS Management Console** and search for **App Runner**.
3. Click **Create Service** -> Connect your GitHub repo.
4. Set Build Settings:
   - **Runtime**: Node.js 18 (or latest)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Port**: `3000`
5. Click **Deploy**. AWS App Runner will automatically provide an HTTPS URL and scale the app.
6. Connect your custom domain `kingofthehalf.com` under the AWS App Runner custom domain configuration tab.
