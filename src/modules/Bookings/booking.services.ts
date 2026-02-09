import { pool } from "../../config/db";


interface BookingData {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

const createBookingService = async (payload: BookingData) => {
  const {customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  // Validate input
  if (!  customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    const err = new Error("All fields are required");
    (err as any).statusCode = 400;
    throw err;
  }

  //Check if vehicle exists & is available
  const vehicleResult = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicle_id]);
  if (vehicleResult.rows.length === 0) {
    const err = new Error("Vehicle not found");
    (err as any).statusCode = 404;
    throw err;
  }

  const vehicle = vehicleResult.rows[0];
  if (vehicle.availability_status !== "available") {
    const err = new Error("Vehicle is not available for booking");
    (err as any).statusCode = 400;
    throw err;
  }

  //Calculate duration
  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);
  const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  if (duration <= 0) {
    const err = new Error("Invalid booking duration");
    (err as any).statusCode = 400;
    throw err;
  }

  //Calculate total price
  const total_price = duration * Number(vehicle.daily_rent_price);

  // Insert booking
  const bookingResult = await pool.query(
    `INSERT INTO bookings (  customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, 'active')
     RETURNING *`,
    [  customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  //Update vehicle status
  await pool.query(`UPDATE vehicles SET availability_status='booked' WHERE id=$1`, [vehicle_id]);

  return bookingResult.rows[0];
};




// viwe booking

const getBookingsService = async (requester: any) => {
  let result;

  //Role-based 
  if (requester.role === "admin") {

    // Admin → all bookings
    result = await pool.query(`
      SELECT 
        b.id, 
        b.customer_id, 
        u.name AS customer_name,
        v.vehicle_name,
        v.registration_number,
        b.rent_start_date, 
        b.rent_end_date, 
        b.total_price, 
        b.status
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id ASC
    `);
  } else {
    // Customer → only own bookings
    result = await pool.query(`
      SELECT 
        b.id, 
        b.customer_id, 
        u.name AS customer_name,
        v.vehicle_name,
        v.registration_number,
        b.rent_start_date, 
        b.rent_end_date, 
        b.total_price, 
        b.status
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
      ORDER BY b.id ASC
    `, [requester.id]);
  }

  return result.rows;
};


//cancel booking , 

// services/BookingService.ts

const updateBooking = async (requester: any, bookingId: string) => {
  // Check if booking exists
  const bookingResult = await pool.query(
    `SELECT * FROM bookings WHERE id=$1`,
    [bookingId]
  );

  if (bookingResult.rows.length === 0) {
    const err = new Error("Booking not found");
    (err as any).statusCode = 404;
    throw err;
  }

  const booking = bookingResult.rows[0];

  // ================= CUSTOMER → CANCEL =================
  if (requester.role === "customer") {
    const now = new Date();
    const startDate = new Date(booking.rent_start_date);

    if (booking.customer_id !== requester.id) {
      const err = new Error("You can cancel only your own booking");
      (err as any).statusCode = 403;
      throw err;
    }

    if (startDate <= now) {
      const err = new Error("You can only cancel before the start date");
      (err as any).statusCode = 400;
      throw err;
    }

    if (booking.status !== "active") {
      const err = new Error("Booking is not active or already cancelled");
      (err as any).statusCode = 400;
      throw err;
    }

    // Update booking
    const updatedBooking = await pool.query(
      `UPDATE bookings
       SET status='cancelled'
       WHERE id=$1
       RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
      [bookingId]
    );

    // Update vehicle availability
    await pool.query(
      `UPDATE vehicles
       SET availability_status='available'
       WHERE id=$1`,
      [booking.vehicle_id]
    );

    return {
      success: true,
      message: "Booking cancelled successfully",
      data: updatedBooking.rows[0],
    };
  }

  // ================= ADMIN → RETURN =================
  if (requester.role === "admin") {
    if (booking.status !== "active") {
      const err = new Error("Booking is not active or already returned");
      (err as any).statusCode = 400;
      throw err;
    }

    const updatedBooking = await pool.query(
      `UPDATE bookings
       SET status='returned'
       WHERE id=$1
       RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
      [bookingId]
    );

    const updatedVehicle = await pool.query(
      `UPDATE vehicles
       SET availability_status='available'
       WHERE id=$1
       RETURNING availability_status`,
      [booking.vehicle_id]
    );

    return {
      success: true,
      message: "Booking marked as returned. Vehicle is now available",
      data: {
        ...updatedBooking.rows[0],
        vehicle: updatedVehicle.rows[0],
      },
    };
  }

  // ================= UNAUTHORIZED =================
  const err = new Error("Unauthorized action");
  (err as any).statusCode = 403;
  throw err;
};



export const bookingService={
    createBookingService,
    getBookingsService,
    updateBooking,
}