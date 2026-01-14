import express, { Request, Response }  from "express";
import auth from "../../middleware/authmiddlware";
import { VController } from "./veichles.controller";

const router= express.Router();



router.get('/', VController.getAllVehicles)
router.post('/', auth("admin") ,VController.addVehicle)
router.get("/:vehicleId", VController.getVehicleById);
router.put("/:vehicleId", auth("admin"), VController.updateVehicle);
router.delete("/:vehicleId", auth("admin"), VController.deleteVehicle)

// router.put('/', auth("admin","customer") ,)
// router.delete('/',auth("admin"),)


export const addVehicle= router;
