import { Request, Response } from "express";
import { VServices } from "./veichles.service";

// create Vehicle
const addVehicle = async (req: Request, res: Response) => {
  try {
    const requester = req.user; // comes from auth middleware

if (!requester || requester.role !== "admin") {
  return res
    .status(403)
    .json({ success: false, message: "Only admin can add vehicles" });
}

    const newVehicle = await VServices.createVehicles(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: newVehicle,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};


//Get all vehicle

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await VServices.getAllVehiclesService();
    res.status(200).json({
      success: true,
      message: "Vehicles fetched successfully",
      data: vehicles,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }

}


//show vehicle by id

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    const vehicle = await VServices.getVehicleByIdService(vehicleId!);

    res.status(200).json({
      success: true,
      message: "Vehicle fetched successfully",
      data: vehicle,
    });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};


// updateVehicle;


// controllers/VehicleController.ts
const updateVehicle = async (req: Request, res: Response) => {
  try {
    const requester = req.user; 
    if (!requester || requester.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admin can update vehicles" });
    }

    const { vehicleId } = req.params;
    if (!vehicleId) {
      return res.status(400).json({ success: false, message: "Vehicle ID is required" });
    }

    const updatedVehicle = await VServices.updateVehicle(vehicleId, req.body);

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: updatedVehicle,
    });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message || "Server error" });
  }
};


//delete vehicle :

 const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const requester = req.user;
    const { vehicleId } = req.params;

     console.log(vehicleId);
    console.log(req.body);

    if (!requester) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Only admin can delete
    if (requester.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admin can delete vehicles" });
    }

    const result = await VServices.deleteVehicle(vehicleId!);

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



export const VController={
    addVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
}


