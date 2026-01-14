import { Request, Response } from "express";
import { bookingService } from "./booking.services";


// create bookings;

 const createBooking = async (req: Request, res: Response) => {
  try {
    const requester = req.user;
    if (!requester) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { vehicle_id, rent_start_date, rent_end_date} = req.body;

    const booking = await bookingService.createBookingService({
      customer_id: requester.id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err: any) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

// show all booking :

const getBookings = async (req: Request, res: Response) => {
  try {
    const requester = req.user;

    if (!requester) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await bookingService.getBookingsService(requester);

    res.status(200).json({
      success: true,
      message:
        requester.role === "admin"
          ? "All bookings fetched successfully"
          : "Your bookings fetched successfully",
      data: bookings,
    });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};


// updatebooking 

 const updateBooking = async (req: Request, res: Response) => {
  try {
    const requester = req.user;
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: "Booking ID is required" });
    }

    const result = await bookingService.updateBooking(requester, bookingId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};





export const bookingController={
    createBooking,
    getBookings,
    updateBooking,
}
