import { body } from "express-validator";

export const createObraSocialValidator = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isString()
    .withMessage("El nombre debe ser texto")
    .trim()
    .escape(),

  body("descripcion")
    .optional()
    .isString()
    .withMessage("La descripción debe ser texto")
    .trim()
    .escape(),
];

export const updateObraSocialValidator = [
  body("nombre")
    .optional()
    .isString()
    .withMessage("El nombre debe ser texto")
    .trim()
    .escape(),

  body("descripcion")
    .optional()
    .isString()
    .withMessage("La descripción debe ser texto")
    .trim()
    .escape(),
];
