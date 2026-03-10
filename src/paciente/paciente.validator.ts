import { body } from "express-validator";

export const registerPacienteValidator = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isString()
    .withMessage("El nombre debe ser un texto"),

  body("apellido")
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .isString()
    .withMessage("El apellido debe ser un texto"),

  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no tiene un formato válido"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),

  body("obraSocialId")
    .notEmpty()
    .withMessage("La obra social es obligatoria")
    .isInt()
    .withMessage("La obra social debe ser un id numérico"),
];

export const registerByAdminValidator = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isString()
    .withMessage("El nombre debe ser un texto"),

  body("apellido")
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .isString()
    .withMessage("El apellido debe ser un texto"),

  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no tiene un formato válido"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),

  body("obraSocialId")
    .notEmpty()
    .withMessage("La obra social es obligatoria")
    .isInt()
    .withMessage("La obra social debe ser un id numérico"),

  body("role")
    .optional()
    .isIn(["admin", "paciente"])
    .withMessage("El role debe ser admin o paciente"),
];

export const loginPacienteValidator = [
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no tiene un formato válido"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),
];

export const updatePacienteValidator = [
  body("nombre")
    .optional()
    .isString()
    .withMessage("El nombre debe ser un texto"),

  body("apellido")
    .optional()
    .isString()
    .withMessage("El apellido debe ser un texto"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("El email no tiene un formato válido"),

  body("telefono")
    .optional()
    .isString()
    .withMessage("El teléfono debe ser un texto"),

  body("obraSocial.id")
    .optional()
    .isInt()
    .withMessage("La obra social debe tener un id numérico"),
];