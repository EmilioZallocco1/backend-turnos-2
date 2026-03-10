import { body, param } from "express-validator";

export const especialidadIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("El id es obligatorio")
    .isInt({ gt: 0 })
    .withMessage("El id debe ser un número entero positivo"),
];

export const addEspecialidadValidator = [
  body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isString()
    .withMessage("El nombre debe ser texto")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  body("description")
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isString()
    .withMessage("La descripción debe ser texto")
    .isLength({ min: 3, max: 255 })
    .withMessage("La descripción debe tener entre 3 y 255 caracteres"),
];

export const updateEspecialidadValidator = [
  param("id")
    .notEmpty()
    .withMessage("El id es obligatorio")
    .isInt({ gt: 0 })
    .withMessage("El id debe ser un número entero positivo"),

  body("name")
    .optional()
    .isString()
    .withMessage("El nombre debe ser texto")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  body("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser texto")
    .isLength({ min: 3, max: 255 })
    .withMessage("La descripción debe tener entre 3 y 255 caracteres"),
];