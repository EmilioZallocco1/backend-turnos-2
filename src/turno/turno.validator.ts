import { body, param, query } from "express-validator";

export const turnoIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("El id es obligatorio")
    .isInt({ gt: 0 })
    .withMessage("El id debe ser un numero entero positivo"),
];

export const addTurnoValidator = [
  body("fecha")
    .notEmpty()
    .withMessage("La fecha es obligatoria")
    .isISO8601()
    .withMessage("La fecha debe tener un formato valido"),

  body("hora")
    .notEmpty()
    .withMessage("La hora es obligatoria")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("La hora debe tener formato HH:mm"),

  body("estado")
    .notEmpty()
    .withMessage("El estado es obligatorio")
    .isString()
    .withMessage("El estado debe ser texto"),

  body("descripcion")
    .optional()
    .isString()
    .withMessage("La descripcion debe ser texto"),

  body("medicoId")
    .notEmpty()
    .withMessage("El medicoId es obligatorio")
    .isInt({ gt: 0 })
    .withMessage("El medicoId debe ser un entero positivo"),

  body("pacienteId")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("El pacienteId debe ser un entero positivo"),
];

export const updateTurnoValidator = [
  param("id")
    .notEmpty()
    .withMessage("El id es obligatorio")
    .isInt({ gt: 0 })
    .withMessage("El id debe ser un numero entero positivo"),

  body("fecha")
    .optional()
    .isISO8601()
    .withMessage("La fecha debe tener un formato valido"),

  body("hora")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("La hora debe tener formato HH:mm"),

  body("estado")
    .optional()
    .isString()
    .withMessage("El estado debe ser texto"),

  body("descripcion")
    .optional()
    .isString()
    .withMessage("La descripcion debe ser texto"),

  body("medicoId")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("El medicoId debe ser un entero positivo"),

  body("pacienteId")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("El pacienteId debe ser un entero positivo"),
];

export const turnosByMedicoValidator = [
  param("id")
    .notEmpty()
    .withMessage("El id del medico es obligatorio")
    .isInt({ gt: 0 })
    .withMessage("El id del medico debe ser un entero positivo"),
];

export const checkOverlapValidator = [
  param("id")
    .notEmpty()
    .withMessage("El id del medico es obligatorio")
    .isInt({ gt: 0 })
    .withMessage("El id del medico debe ser un entero positivo"),

  query("inicio")
    .optional()
    .isISO8601()
    .withMessage("inicio debe ser una fecha valida ISO8601"),

  query("fin")
    .optional()
    .isISO8601()
    .withMessage("fin debe ser una fecha valida ISO8601"),

  query("duracionMin")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("duracionMin debe ser un entero positivo"),
];

export const horariosDisponiblesValidator = [
  query("medicoId")
    .notEmpty()
    .withMessage("medicoId es requerido")
    .isInt({ gt: 0 })
    .withMessage("medicoId debe ser un entero positivo"),

  query("fecha")
    .notEmpty()
    .withMessage("fecha es requerida")
    .isISO8601()
    .withMessage("fecha debe tener formato valido"),
];
