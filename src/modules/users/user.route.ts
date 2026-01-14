import express, { Request, Response }  from "express";
import { UserController } from "./user.controller";
import auth from "../../middleware/authmiddlware";

const router= express.Router();



// promised type void that why no need to call;
router.get('/', auth("admin") ,UserController.getAllUsers)
router.put('/:userId', auth("admin","customer") ,UserController.updateUser)
router.delete('/:userId',auth("admin"),UserController.deleteUser)


export const userRoutes = router;
