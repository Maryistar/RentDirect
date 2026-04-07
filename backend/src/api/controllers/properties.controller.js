import * as service from '../../services/properties.service.js';
import * as repository from '../../repositories/properties.repository.js';

// 🔹 CREATE
export async function createProperty(req, res, next) {
  try {
    const result = await service.createProperty(
      req.body,
      req.user,
      req.files 
    );

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// 🔹 LIST AVAILABLE
export async function listAvailableProperties(req, res, next) {
  try {
    const result = await service.listAvailable();
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// 🔹 GET ONE
export async function getProperty(req, res, next) {
  try {
    const result = await service.getProperty(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// 🔹 MY PROPERTIES
export async function listOwnerProperties(req, res, next) {
  try {
    const result = await service.listOwnerProperties(req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// 🔹 UPDATE
export async function updateProperty(req, res, next) {
  try {
    const result = await service.updateProperty(
      req.params.id,
      req.body,
      req.user
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// 🔹 DELETE
export async function deleteProperty(req, res, next) {
  try {
    const result = await service.deleteProperty(
      req.params.id,
      req.user
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function listAllProperties(req, res, next) {
  try {
    const result = await repository.getAllWithImages();
    res.json(result);
  } catch (err) {
    next(err);
  }
}

