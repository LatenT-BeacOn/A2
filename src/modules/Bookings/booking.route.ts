import express, { Request, Response }  from "express";
import auth from "../../middleware/authmiddlware";
import { bookingController } from "./booking.conteoller";

const router= express.Router();


router.post('/', auth("admin","customer") ,bookingController.createBooking)
router.get("/", auth("admin", "customer"), bookingController.getBookings);
router.put("/:bookingId", auth("admin", "customer"), bookingController.updateBooking);



export const bookingRoute = router;
