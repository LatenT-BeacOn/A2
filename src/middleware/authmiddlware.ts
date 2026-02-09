import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      console.log({ authHeader });

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "Access denied: Missing authorization header",
        });
      }

      
      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Invalid authorization format",
        });
      }

      const decoded = jwt.verify(
        token,
        config.jwt_web as string
      ) as JwtPayload;

      console.log({ decoded });

      req.user = decoded;

      // role check
      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "auth failed",
      });
    }
  };
};

export default auth;