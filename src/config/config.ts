import dotenv from "dotenv"
import path from "path";
dotenv.config({path: path.join(process.cwd(),".env")});

// check if .env file is loaded or not 
console.log("DATABASE URL:", process.env.CONNECTION_STRING);

const config={
    connect_str: process.env.CONNECTION_STRING,
    port: process.env.PORT,
    jwt_web: process.env.JWT_WEB
   
}

export default config;

