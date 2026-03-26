import * as service from '../../services/auth.service.js';
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import db from "../../config/db.js";

// 🔥 TU CLIENT ID REAL
const GOOGLE_CLIENT_ID = "804110338623-b4r7nq82p6pig7ivrtim8get0mjut7hm.apps.googleusercontent.com";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    // 🔥 RECIBE EL TOKEN DESDE EL FRONT
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token no enviado" });
    }

    // 🔥 VERIFICAR TOKEN CON GOOGLE
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, picture } = payload;

    // 🔍 BUSCAR USUARIO
    let [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    let user;

    // 🆕 SI NO EXISTE → CREAR
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

    // 🔐 GENERAR JWT
    const tokenJWT = jwt.sign(
      { id: user.id, role: user.role },
      "secreto_super_seguro", // 🔥 puedes cambiar esto luego
      { expiresIn: "7d" }
    );

    // ✅ RESPUESTA FINAL
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
export async function register(req, res, next) {
  try {
    const result = await service.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// 🔹 VERIFY EMAIL
export async function verifyEmail(req, res, next) {
  try {
    const result = await service.verifyEmail(
      req.body.email,
      req.body.code
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// 🔹 LOGIN
export async function login(req, res, next) {
  try {
    const result = await service.login(
      req.body.email,
      req.body.password
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// 🔹 FORGOT PASSWORD
export async function forgotPassword(req, res, next) {
  try {
    const result = await service.forgotPassword(req.body.email);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// 🔹 RESET PASSWORD
export async function resetPassword(req, res, next) {
  try {
    const result = await service.resetPassword(
      req.body.email,
      req.body.code,
      req.body.newPassword
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}