import { Request, Response } from "express";
import { UserServices } from "./user.services";




// Get All Users

const getAllUsers=async(req:Request,res:Response)=>{

//   const {id}=req.params;

  try{

    const result= await UserServices.getAllUsers();
    if(result.rows.length===0){
      return res.status(200).json({
        success:"true",
        massage:"user not found"
      })
    }
    
    res.status(200).json({
      success:"true",
      data: result.rows,
    })


  }
  catch(err:any){
    res.status(500).json({
      success:"false ",
      massage :err.massage
    })
  }
}



//update users;


 const updateUser = async (req: Request, res: Response) => {
  try {
    const requester = req.user;
    const { userId } = req.params;
    const updateData = req.body;

    if (!requester) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const updatedUser = await UserServices.updateUserService(requester, userId!, updateData);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};




// delete User

 const deleteUser = async (req: Request, res: Response) => {
  try {
    const requester = req.user; 
    const { userId } = req.params;

    if (!requester) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Only admin can delete
    if (requester.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admin can delete users" });
    }

    const result = await UserServices.deleteUser(userId!);

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



export const UserController={
    getAllUsers,
   updateUser,
    deleteUser

}