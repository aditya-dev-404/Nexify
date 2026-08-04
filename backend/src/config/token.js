import jwt from "jsonwebtoken";
import { ENV } from "./env.config.js";

const generateToken = (userId) => {
    return jwt.sign(
        { id:userId },
        ENV.SECRET_KEY,
        { expiresIn: "15d" }
    );
};

export default generateToken;