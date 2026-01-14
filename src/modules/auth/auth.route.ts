import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();


router.post("/signup" ,authController.singUp);
router.post("/signin" , authController.signIn)


// router.post("/signup" ,authController.singUp);



export const authRoutes = router;