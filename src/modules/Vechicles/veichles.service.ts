import { pool } from "../../config/db";




//create vehicle
const createVehicles = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  // Validation (basic)
  if (!vehicle_name || !type || !registration_number || !daily_rent_price || !availability_status) {
    throw new Error("All fields are required");
  }

  // Type validation
  const validTypes = ["car", "bike", "van", "SUV"];
  if (!validTypes.includes(type as string)) {
    throw new Error("Invalid vehicle type. Must be 'car', 'bike', 'van' or 'SUV'");
  }

  const validStatus = ["available", "booked"];
  if (!validStatus.includes(availability_status as string)) {
    throw new Error("Invalid availability status. Must be 'available' or 'booked'");
  }

  // Check if registration already exists
  const existing = await pool.query(
    `SELECT * FROM vehicles WHERE registration_number = $1`,
    [registration_number]
  );
  if (existing.rows.length > 0) {
    throw new Error("Vehicle with this registration number already exists");
  }

  // Insert into database
  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );

  return result.rows[0];
};


//get all vehicle
const getAllVehiclesService = async () => {
  const result = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status 
     FROM vehicles
     ORDER BY id ASC`
  );

  return result.rows; 
};



// show specifiq one:

const getVehicleByIdService = async (vehicleId: string) => {
  const result = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status 
     FROM vehicles
     WHERE id=$1`,
    [vehicleId]
  );

  if (result.rows.length === 0) {
    const err = new Error("Vehicle not found");
    (err as any).statusCode = 404;
    throw err;
  }

  return result.rows[0]; 
};



//update vehicle


interface VehicleUpdateData {
  vehicle_name?: string;
  type?: string;
  registration_number?: string;
  daily_rent_price?: number;
  availability_status?: string;
}
const updateVehicle = async (vehicleId: string, updateData: VehicleUpdateData) => {
  // Check if vehicle exists
  const vehicleCheck = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicleId]);
  if (vehicleCheck.rows.length === 0) {
    const err = new Error("Vehicle not found");
    (err as any).statusCode = 404;
    throw err;
  }

  const currentVehicle = vehicleCheck.rows[0];

  // Prepare updated values (keep existing if undefined)
  const vehicle_name = updateData.vehicle_name || currentVehicle.vehicle_name;
  const type = updateData.type || currentVehicle.type;
  const registration_number = updateData.registration_number || currentVehicle.registration_number;
  const daily_rent_price = updateData.daily_rent_price ?? currentVehicle.daily_rent_price;
  const availability_status = updateData.availability_status || currentVehicle.availability_status;

  // Validate type and availability_status
  const validTypes = ["car", "bike", "van", "SUV"];
  if (!validTypes.includes(type)) {
    const err = new Error("Invalid vehicle type. Must be 'car', 'bike', 'van' or 'SUV'");
    (err as any).statusCode = 400;
    throw err;
  }

  const validStatus = ["available", "booked"];
  if (!validStatus.includes(availability_status)) {
    const err = new Error("Invalid availability status. Must be 'available' or 'booked'");
    (err as any).statusCode = 400;
    throw err;
  }

  // Check if registration_number already exists in another vehicle
  const regCheck = await pool.query(
    `SELECT * FROM vehicles WHERE registration_number=$1 AND id <> $2`,
    [registration_number, vehicleId]
  );
  if (regCheck.rows.length > 0) {
    const err = new Error("Another vehicle with this registration number already exists");
    (err as any).statusCode = 400;
    throw err;
  }

  // Update the vehicle
  const result = await pool.query(
    `UPDATE vehicles
     SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5
     WHERE id=$6
     RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status, vehicleId]
  );

  return result.rows[0];
};



// delete vehicles

 const deleteVehicle = async (vehicleId: string) => {

  // Check if vehicle exists
  const vehicleResult = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicleId]);
  if (vehicleResult.rows.length === 0) {
    const err = new Error("Vehicle not found");
    (err as any).statusCode = 404;
    throw err;
  }

  //Check for active bookings
  const bookingResult = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id=$1 AND status='active'`,
    [vehicleId]
  );

  if (bookingResult.rows.length > 0) {
    const err = new Error("Cannot delete vehicle with active bookings");
    (err as any).statusCode = 400;
    throw err;
  }

  // Delete vehicle
  await pool.query(`DELETE FROM vehicles WHERE id=$1`, [vehicleId]);

  return { message: "Vehicle deleted successfully" };
};





export const VServices = {
  createVehicles,
  getAllVehiclesService,
  getVehicleByIdService,
  updateVehicle,
  deleteVehicle,
};
