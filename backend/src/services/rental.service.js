import * as rentalRepo from '../repositories/rental.repository.js';
import * as applicationsRepo from '../repositories/applications.repository.js';

async function createRentalRecord(data, user) {

  const application = await applicationsRepo.findApplicationWithOwner(
    data.application_id
  );

  if (!application) {
    throw { status: 404, message: 'Application not found' };
  }

  if (user.role !== 'admin' && application.owner_id !== user.id) {
    throw { status: 403, message: 'Forbidden' };
  }

  const existing = await rentalRepo.findByApplication(data.application_id);

  if (existing) {
    throw {
      status: 409,
      message: 'Rental record already exists for this application'
    };
  }

  const start = new Date(data.start_date);
  const end = new Date(data.end_date);

  const durationMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  if (durationMonths <= 0) {
    throw {
      status: 400,
      message: 'End date must be after start date'
    };
  }

  const rentalId = await rentalRepo.createRentalRecord({
    application_id: data.application_id,
    property_id: application.property_id,
    owner_id: application.owner_id,
    tenant_id: application.tenant_id,
    start_date: data.start_date,
    end_date: data.end_date,
    monthly_price: data.monthly_price,
    deposit: data.deposit || 0,
    duration_months: durationMonths
  });

  await applicationsRepo.updateApplication(application.id, 'agreed');

  return {
    message: 'Rental record created successfully',
    rentalId
  };
}

async function listTenantRentals(user) {

  if (user.role !== 'tenant' && user.role !== 'admin') {
    throw { status: 403, message: 'Forbidden' };
  }

  return await rentalRepo.getRentalsByTenant(user.id);
}

export default {
  createRentalRecord,
  listTenantRentals
};