import * as repo from '../repositories/applications.repository.js';
import * as propertyRepo from '../repositories/properties.repository.js';


// 🔹 APPLY
export async function applyToProperty(propertyId, tenantId, message) {

  const property = await propertyRepo.findPropertyById(propertyId);

  if (!property) {
    throw { status: 404, message: 'Property not found' };
  }

  if (property.status === 'rented') {
    throw { status: 400, message: 'Property already rented' };
  }

  const user = await repo.findUserScore(tenantId);

  if (user.score < 500) {
    const total = await repo.countMonthlyApplications(tenantId);

    if (total >= 2) {
      throw {
        status: 403,
        message: 'Low score users can only apply to 2 properties per month.'
      };
    }
  }

  const exists = await repo.findExistingApplication(propertyId, tenantId);

  if (exists) {
    throw { status: 409, message: 'You already applied to this property' };
  }

  const applicationId = await repo.createApplication(
    propertyId,
    tenantId,   // 🔥 IMPORTANTE
    message
  );

  return {
    message: 'Application submitted',
    applicationId
  };
}


// 🔹 LIST MINE
export async function listMyApplications(tenantId) {

  const applications = await repo.getApplicationsByTenant(tenantId);

  return applications.map(app => ({
    ...app,
    propertyTitle: app.propertyTitle || app.title || "Propiedad",
    created_at: app.created_at || app.createdAt || null
  }));
}


// 🔹 OWNER → LIST APPLICATIONS FOR A PROPERTY
export async function listApplicationsForProperty(propertyId, user) {

  const property = await propertyRepo.findPropertyById(propertyId);

  if (!property) {
    throw { status: 404, message: 'Property not found' };
  }

  // Solo dueño o admin
  if (user.role !== 'admin' && property.owner_id !== user.id) {
    throw { status: 403, message: 'Forbidden' };
  }

  const applications = await repo.getApplicationsByProperty(propertyId);

  // 🔹 🔹 CORRECCIÓN CLAVE: usar exactamente el nombre que devuelve el repo
  return applications.map(app => ({
    ...app,
    user_name: app.user_name || "Usuario",  // 🔹 aquí sí usamos user_name
  }));
}


// 🔹 UPDATE STATUS
export async function updateApplicationStatus(applicationId, status, user) {

  if (!['in_review', 'agreed', 'contract_signed', 'active', 'rejected'].includes(status)) {
    throw { status: 400, message: 'Invalid status' };
  }

  const application = await repo.findApplicationWithOwner(applicationId);

  if (!application) {
    throw { status: 404, message: 'Application not found' };
  }

  if (user.role !== 'admin' && application.owner_id !== user.id) {
    throw { status: 403, message: 'Forbidden' };
  }

  const validTransitions = {
    pending: ['in_review', 'rejected'],
    in_review: ['agreed', 'rejected'],
    agreed: ['contract_signed', 'rejected'],
    contract_signed: ['active'],
    active: [],
    rejected: []
  };

  if (!validTransitions[application.status]?.includes(status)) {
    throw {
      status: 400,
      message: `Cannot change status from ${application.status} to ${status}`
    };
  }

  await repo.updateApplication(applicationId, status);

  if (status === 'agreed') {
    await repo.rejectOtherApplications(application.property_id, applicationId);
  }

  if (status === 'active') {
    await repo.markPropertyAsRented(application.property_id);
  }

  return { message: 'Application updated successfully' };
}


export async function withdrawApplication(applicationId, user) {

  const application = await repo.findApplicationWithOwner(applicationId);

  if (!application) {
    throw { status: 404, message: 'Application not found' };
  }

  if (user.role !== 'admin' && application.tenant_id !== user.id) {
    throw { status: 403, message: 'Forbidden' };
  }

  await repo.deleteApplication(applicationId);

  return { message: 'Application withdrawn' };
}