import rateLimit from "express-rate-limit";

// LIMITADOR PARA LOGIN
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 5, // máximo 5 intentos por IP
  message: {
    message: "Demasiados intentos de login, intenta en 10 minutos",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// LIMITADOR PARA REGISTER
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 registros por IP
  message: {
    message: "Demasiados registros desde esta IP, intenta más tarde",
  },
});