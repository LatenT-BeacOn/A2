import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.route";
import { userRoutes } from "./modules/users/user.route";
import { addVehicle } from "./modules/Vechicles/vechle.route";
import { bookingRoute } from "./modules/Bookings/booking.route";
const app = express();


// parser
app.use(express.json());


// initializing db
initDB();


app.get("/",  (req: Request, res: Response) => {
  res.send("Hello World! Next level");
});







//auth routes
app.use("/api/v1/auth/",authRoutes);

app.use("/api/v1/users",userRoutes);

app.use("/api/v1/vehicles",addVehicle);

app.use("/api/v1/bookings",bookingRoute);





// Not found

app.use((req:Request, res: Response) =>{

    res.status(404).json({
        success:false,
        message: "Route not found",
        path: req.path
    })


})




export default app;