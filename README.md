#  Vehicle Rental System

A **backend RESTful API** for managing a complete vehicle rental process — including vehicles, customers, and bookings — with **secure authentication** and **role-based authorization**.

Live API URL: https://vehicle-rental-system-iota-ten.vercel.app/


---

## Project Overview

The **Vehicle Rental System** simplifies rental operations by allowing admins to manage vehicles and customers, while customers can browse available vehicles, make bookings, and track their rentals.


## Features

###  Admin Features
- Manage all vehicles (create, update, delete).
- Manage users and their roles.
- View all bookings in the system.
- Delete users or vehicles (only if no active bookings exist).

### Customer Features
- Register and log in securely.
- View available vehicles and their details.
- Create and manage their own bookings.
- Cancel bookings before the start date.

### Authentication & Authorization
- Secure **JWT-based authentication**.
- Passwords hashed using **bcrypt**.
- Role-based access: `admin` and `customer`.
- Token validation for all protected routes.

---

##  Technology Stack
Backend: Node.js + TypeScript
Framework: Express.js
Database: PostgreSQL
Authentication: JWT (jsonwebtoken)
Password Security: bcrypt

---

##  Folder Structure

VEHICLE-RENTAL-SYSTEM/
│
├── .vercel/
├── dist/
├── node_modules/
├── src/
│   ├── config/
│   │   ├── config.ts
│   │   └── db.ts
│   ├── middleware/
│   │   └── authmiddleware.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── Bookings/
│   │   ├── users/
│   │   └── Vechicles/
│   ├── types/
│   ├── app.ts
│   └── server.ts
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── vercel.json



Each module (e.g. `vehicles`, `bookings`) follows a **layered structure** with:
- `routes/` → Express routes
- `controllers/` → Request handling logic
- `services/` → Business logic

---

## Setup Instructions

### Clone the Repository
npm run dev # For development with ts-node npm run build # Compile TypeScript npm start # Run compiled JavaScript

