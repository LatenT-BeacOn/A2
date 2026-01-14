import { pool } from "../../config/db";


const getAllUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};






// services/UserService.ts
 interface UserUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  age?: number;
  address?: string;
  password?: string;
}
const updateUserService = async (
  requester: any,
  userId: string,
  updateData: UserUpdateData
) => {
  // 1️⃣ Check if user exists
  const userCheck = await pool.query(`SELECT * FROM users WHERE id=$1`, [userId]);
  if (userCheck.rows.length === 0) {
    const err = new Error("User not found");
    (err as any).statusCode = 404;
    throw err;
  }

  const user = userCheck.rows[0];

  // 2️⃣ Customer restriction
  if (requester.role === "customer" && requester.id !== Number(userId)) {
    const err = new Error("You can update only your own profile");
    (err as any).statusCode = 403;
    throw err;
  }

  // 3️⃣ Decide final values: use provided data, else keep old
  const finalName = updateData.name ?? user.name;
  const finalEmail = updateData.email ?? user.email;
  const finalPhone = updateData.phone ?? user.phone;
  const finalAge = updateData.age ?? user.age;
  const finalAddress = updateData.address ?? user.address;
  const finalPassword = updateData.password ?? user.password;

  // Role can only be changed by admin
  const finalRole =
    requester.role === "admin" ? updateData.role ?? user.role : user.role;

  // 4️⃣ Update query
  const result = await pool.query(
    `UPDATE users 
     SET name=$1, email=$2, phone=$3, role=$4, age=$5, address=$6, password=$7
     WHERE id=$8
     RETURNING id, name, email, phone, role, age, address`,
    [finalName, finalEmail, finalPhone, finalRole, finalAge, finalAddress, finalPassword, userId]
  );

  return result.rows[0];
};



// delete user

 const deleteUser = async (userId: string) => {

  // Check if user exists
  const userResult = await pool.query(`SELECT * FROM users WHERE id=$1`, [userId]);
  if (userResult.rows.length === 0) {
    const err = new Error("User not found");
    (err as any).statusCode = 404;
    throw err;
  }

  //Check if user has active bookings
  const bookingResult = await pool.query(
    `SELECT * FROM bookings WHERE customer_id=$1 AND status='active'`,
    [userId]
  );

  if (bookingResult.rows.length > 0) {
    const err = new Error("Cannot delete user with active bookings");
    (err as any).statusCode = 400;
    throw err;
  }

  // Delete user
  await pool.query(`DELETE FROM users WHERE id=$1`, [userId]);

  return { message: "User deleted successfully" };
};











export const UserServices={
    getAllUsers,
    updateUserService,
    
    deleteUser
  
  
}