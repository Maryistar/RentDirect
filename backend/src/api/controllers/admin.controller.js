import db from "../../config/db.js";

export async function getStats(req, res) {
  try {
    const [[users]] = await db.query("SELECT COUNT(*) as total FROM users");
    const [[properties]] = await db.query("SELECT COUNT(*) as total FROM properties");
    const [[contracts]] = await db.query("SELECT COUNT(*) as total FROM contracts");

    res.json({
      users: users.total,
      properties: properties.total,
      contracts: contracts.total,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo estadísticas" });
  }
}