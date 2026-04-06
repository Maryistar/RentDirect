import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import * as repo from '../repositories/auth.repository.js';
import { sendVerificationEmail } from './email.service.js';

dotenv.config();

/* =========================
   VARIABLES SEGURAS
========================= */
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

//  VALIDACIÓN CRÍTICA
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido en el .env");
}

/* =========================
   REGISTER
========================= */
export async function register(data) {

  const { email, password, name, role, cedula } = data;

  if (!email || !password || !role || !cedula) {
    throw { status: 400, message: 'Missing fields' };
  }

  if (!/^\d{6,10}$/.test(cedula)) {
    throw { status: 400, message: 'Invalid cedula format' };
  }

  if (await repo.emailExists(email)) {
    throw { status: 409, message: 'Email already registered' };
  }

  if (await repo.cedulaExists(cedula)) {
    throw { status: 409, message: 'Cedula already registered' };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  await repo.createUser({
    role,
    email,
    passwordHash,
    name: name || null,
    cedula,
    verificationCode,
    expires
  });

  await sendVerificationEmail(email, verificationCode);

  return { message: 'User registered. Please verify your email.' };
}

/* =========================
   VERIFY EMAIL
========================= */
export async function verifyEmail(email, code) {

  if (!email) throw { status: 400, message: 'Email is required' };

  const user = await repo.findUserByEmail(email);

  if (!user) throw { status: 404, message: 'User not found' };

  if (user.is_verified) {
    return { message: 'User already verified' };
  }

  if (!code) {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await repo.updateVerification(email, newCode, expires);
    await sendVerificationEmail(email, newCode);

    return { message: 'Verification code resent to email' };
  }

  if (user.verification_code !== code)
    throw { status: 400, message: 'Invalid code' };

  if (new Date() > new Date(user.verification_expires))
    throw { status: 400, message: 'Code expired' };

  await repo.confirmUser(email);

  return { message: 'Email verified successfully' };
}

/* =========================
   LOGIN
========================= */
export async function login(email, password) {

  if (!email || !password)
    throw { status: 400, message: 'Missing fields' };

  const user = await repo.findUserByEmail(email);

  if (!user)
    throw { status: 401, message: 'Invalid credentials' };

 
  if (user.status === "inactive")
    throw { status: 403, message: "Usuario desactivado" };

  if (!user.is_verified)
    throw { status: 401, message: 'Please verify your email before logging in.' };

  const ok = await bcrypt.compare(password, user.password_hash);

  if (!ok)
    throw { status: 401, message: 'Invalid credentials' };

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN
    }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }
  };
}

/* =========================
   FORGOT PASSWORD
========================= */
export async function forgotPassword(email) {

  if (!email)
    throw { status: 400, message: 'Email is required' };

  const user = await repo.findUserByEmail(email);

  if (!user)
    throw { status: 404, message: 'User not found' };

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  await repo.saveResetCode(email, resetCode, expires);
  await sendVerificationEmail(email, resetCode, 'Password reset code');

  return { message: 'Password reset code sent to your email' };
}

/* =========================
   RESET PASSWORD
========================= */
export async function resetPassword(email, code, newPassword) {

  if (!email || !code || !newPassword)
    throw { status: 400, message: 'Missing fields' };

  const user = await repo.findUserByEmail(email);

  if (!user)
    throw { status: 404, message: 'User not found' };

  if (user.reset_code !== code)
    throw { status: 400, message: 'Invalid code' };

  if (new Date() > new Date(user.reset_expires))
    throw { status: 400, message: 'Code expired' };

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await repo.updatePassword(email, passwordHash);

  return { message: 'Password updated successfully' };
}