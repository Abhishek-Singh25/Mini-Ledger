# MiniLedger

MiniLedger is a web application for tracking money lent to friends, monitoring repayments, and identifying overdue loans.

## Features

- Phone number-based mock OTP authentication
- JWT authentication and protected API routes
- Add and view loans
- Mark loans as repaid
- Summary of total lent, repaid, and overdue amounts
- Responsive dashboard

## Tech Stack

- **Frontend:** React.js, Vite, Axios
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** Mock OTP, JWT

## Database Schema

The database contains two tables:

- `users` — Stores user information.
- `loans` — Stores loan details and repayment status.

See [`schema.sql`](schema.sql) for the complete database schema.

## Run Locally

**Prerequisites:** Node.js, npm, and a PostgreSQL database.

1. Clone the repository:

   ```bash
   git clone https://github.com/Abhishek-Singh25/Mini-Ledger/
   ```

2. Set up the database using `schema.sql`.

3. Install and start the backend:

   ```bash
   cd Backend
   npm install
   npm run dev
   ```

4. Configure the backend `.env` file with `DATABASE_URL`, `JWT_SECRET`, and `PORT`.

5. Open another terminal and start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. Open the local URL displayed by Vite.

## Note

The OTP is printed in the backend console for testing.

## Author

Abhishek Singh
