import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

/* =========================
   STORAGE CLOUDINARY
========================= */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // 🔥 Detectar tipo de subida
    let folder = "rentdirect/misc";

    if (file.fieldname === "file") {
      folder = "rentdirect/avatars";
    }

    if (file.fieldname === "document") {
      folder = "rentdirect/documents";
    }

    return {
      folder,
      allowed_formats: ["jpg", "png", "jpeg", "pdf"],
      transformation: [
        {
          width: 500,
          height: 500,
          crop: "limit",
        },
      ],
    };
  },
});

/* =========================
   EXPORT MULTER
========================= */
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});