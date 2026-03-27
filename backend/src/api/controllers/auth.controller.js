import * as service from '../../services/auth.service.js';
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import db from "../../config/db.js";

// 🔥 CLIENT ID GOOGLE
const GOOGLE_CLIENT_ID = "804110338623-b4r7nq82p6pig7ivrtim8get0mjut7hm.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// 🔹 GOOGLE LOGIN
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token no enviado" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    let { email, name, picture } = payload;
    email = email.toLowerCase(); // Normalizar email

    let [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    let user;

    if (users.length === 0) {
      const [result] = await db.query(
        "INSERT INTO users (name, email, avatar, role) VALUES (?, ?, ?, ?)",
        [name, email, picture, "tenant"]
      );

      user = {
        id: result.insertId,
        name,
        email,
        avatar: picture,
        role: "tenant",
      };
    } else {
      user = users[0];
    }

   const tokenJWT = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN }
);

    res.json({
      message: "Login con Google exitoso",
      token: tokenJWT,
      user,
    });

  } catch (error) {
    console.error("ERROR GOOGLE LOGIN:", error);
    res.status(401).json({ message: "Google login failed" });
  }
};

// 🔹 REGISTER
export const register = async (req, res, next) => {
  try {
    const result = await service.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// 🔹 VERIFY EMAIL
export const verifyEmail = async (req, res, next) => {
  try {
    const result = await service.verifyEmail(req.body.email, req.body.code);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// 🔹 LOGIN NORMAL
export const login = async (req, res, next) => {
  try {
    const result = await service.login(req.body.email, req.body.password);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// 🔹 FORGOT PASSWORD
export const forgotPassword = async (req, res, next) => {
  try {
    const result = await service.forgotPassword(req.body.email);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// 🔹 RESET PASSWORD
export const resetPassword = async (req, res, next) => {
  try {
    const result = await service.resetPassword(req.body.email, req.body.code, req.body.newPassword);
    res.json(result);
  } catch (err) {
    next(err);
  }
};