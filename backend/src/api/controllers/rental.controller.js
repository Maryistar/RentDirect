import rentalService from '../../services/rental.service.js';

export async function createRental(req, res, next) {
  try {
    const result = await rentalService.createRentalRecord(
      req.body,
      req.user
    );

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function listMyRentals(req, res, next) {
  try {
    const result = await rentalService.listTenantRentals(req.user);

    res.json(result);
  } catch (err) {
    next(err);
  }
}