// higher order function return korbe function ke !

import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";


const auth=(...roles:string[])=>{

    return async (req:Request,res:Response,next: NextFunction)=>{
        
  try{
    const token=req.headers.authorization;

        console.log({authToken:token})

        if(!token){
             return res.status(401).json({
          success: false,
          message: "Access denied: Missing authorization header",
        });


        }


        const decoded = jwt.verify(token,config.jwt_web as string) as JwtPayload;
        console.log({decoded});

        req.user=decoded;

        if(roles.length && !roles.includes(decoded.role as string)){
            return res.status(500).json({
                error:"unauthorized!"
            })
        }


      

        next();
    }
  catch(err){
    res.status(500).json({
        success:false,
        massage:"auth failed"
    })
  }


}

}


export default auth;