import { Request, Response } from "express";
import { authServices } from "./auth.service";

const singUp = async (req: Request, res: Response) => {
  try {
    const user = await authServices.signUp(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authServices.signIn(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const authController={
    singUp,
    signIn

}