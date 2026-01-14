import { Pool } from "pg";
import config from "./config";

// DB connection
export const pool = new Pool({
  connectionString: config.connect_str,
});

const initDB = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(200) UNIQUE NOT NULL CHECK (email = LOWER(email)),
        password TEXT NOT NULL CHECK (LENGTH(password) >= 6),
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'customer'))
      )
    `);

    // Vehicles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(200) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
        registration_number VARCHAR(100) UNIQUE NOT NULL,
        daily_rent_price NUMERIC(10) NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(50) NOT NULL CHECK (availability_status IN ('available', 'booked'))
      )
    `);

    // Bookings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
        total_price NUMERIC(10) NOT NULL CHECK (total_price > 0),
        status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned'))
      )
    `);

    console.log("All tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

export default initDB;