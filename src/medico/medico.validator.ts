import { body, param } from "express-validator";

export const medicoIdValidator = [
  param("id")
    .isInt()
    .withMessage("El id debe ser numérico"),
];

export const addMedicoValidator = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isString()
    .withMessage("El nombre debe ser texto"),

  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no tiene un formato válido"),

  body("telefono")
    .optional()
    .isString()
    .withMessage("El teléfono debe ser texto"),

  body("especialidad.id")
    .notEmpty()
    .withMessage("La especialidad es obligatoria")
    .isInt()
    .withMessage("El id de especialidad debe ser numérico"),

  body("obraSocial.id")
    .optional()
    .isInt()
    .withMessage("El id de obra social debe ser numérico"),
];

export const updateMedicoValidator = [
  param("id")
    .isInt()
    .withMessage("El id debe ser numérico"),

  body("nombre")
    .optional()
    .isString()
    .withMessage("El nombre debe ser texto"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("El email no tiene un formato válido"),

  body("telefono")
    .optional()
    .isString()
    .withMessage("El teléfono debe ser texto"),

  body("especialidad.id")
    .optional()
    .isInt()
    .withMessage("El id de especialidad debe ser numérico"),

  body("obraSocial.id")
    .optional()
    .isInt()
    .withMessage("El id de obra social debe ser numérico"),
];