import db from "../../config/db.js";

export async function getStats(req, res) {
  try {
    
    const [
      [[users]],
      [[properties]],
      [[contracts]],
      [[invoices]],
    ] = await Promise.all([
      db.query("SELECT COUNT(*) as total FROM users"),
      db.query("SELECT COUNT(*) as total FROM properties"),
      db.query("SELECT COUNT(*) as total FROM contracts"),
      db.query("SELECT COUNT(*) as total FROM invoices"),
    ]);

    res.json({
      users: users.total,
      properties: properties.total,
      contracts: contracts.total,
      invoices: invoices.total,
    });

  } catch (error) {
    console.error("ERROR STATS:", error);
    res.status(500).json({
      message: "Error obteniendo estadísticas",
    });
  }
}