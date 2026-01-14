
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config/config";
import { pool } from "../../config/db";






const signUp = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  if (!name || !email || !password || !role || !phone) {
    throw new Error("All fields are required");
  }

  const emailLower = (email as string).toLowerCase();

  if ((password as string).length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const validRoles = ["admin", "customer"];

  if (!validRoles.includes(role as string)) {
    throw new Error("Invalid role");
  }

  const hashedPass = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO Users(name,email,password,phone,role)
     VALUES($1,$2,$3,$4,$5) RETURNING id, name, email, phone, role`,
    [name, emailLower, hashedPass, phone, role]
  );

  return result.rows[0]; 
};






const signIn = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email  password  required");
  }

  const emailLower = email.toLowerCase();

  const result = await pool.query(`SELECT * FROM Users WHERE email = $1`, [
    emailLower,
  ]);

  if (result.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid email or password");
  }

  const secret = config.jwt_web as string;

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: "7d" }
  );

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  return { token, user: userData };
};

export const authServices = {
  signIn,
  signUp,
};