import * as service from '../../services/applications.service.js';

/**
 * APPLY → Aplicar a una propiedad (TENANT)
 */
export async function applyToProperty(req, res, next) {
  try {
    const result = await service.applyToProperty(
      req.params.id, // property_id
      req.user.id,   // user_id del token
      req.body.message
    );

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * LIST MINE → Ver mis aplicaciones (TENANT)
 */
export async function listMyApplications(req, res, next) {
  try {
    const result = await service.listMyApplications(req.user.id);

    // 🔹 Retornar siempre { data: [...] } para que el frontend funcione con login Google
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * OWNER → Ver aplicaciones de una propiedad
 */
export async function listApplicationsForProperty(req, res, next) {
  try {
    const result = await service.listApplicationsForProperty(
      req.params.id, // property_id
      req.user       // info del usuario que está viendo la propiedad
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * UPDATE → Aprobar / rechazar aplicación (OWNER)
 */
export async function updateApplicationStatus(req, res, next) {
  try {
    const result = await service.updateApplicationStatus(
      req.params.id, // application_id
      req.body.status,
      req.user
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * WITHDRAW → Retirar aplicación (TENANT)
 */
export async function withdrawApplication(req, res, next) {
  try {
    const result = await service.withdrawApplication(
      req.params.id, // application_id
      req.user
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
}