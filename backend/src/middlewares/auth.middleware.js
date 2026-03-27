import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const secret = process.env.JWT_SECRET || 'change_me';


export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log("HEADER:", authHeader); // 👈 agrega esto

  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  console.log("TOKEN RECIBIDO:", token); // 👈 agrega esto
  console.log("SECRET:", secret); // 👈 agrega esto

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch (err) {
    console.log("ERROR VERIFY:", err.message); // 👈 CLAVE
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function authorize(roles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.length || roles.includes(req.user.role)) return next();
    return res.status(403).json({ message: 'Forbidden' });
  };
}
