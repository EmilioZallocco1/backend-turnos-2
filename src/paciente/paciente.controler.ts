import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Paciente } from "./paciente.entity.js";
import bcrypt from "bcrypt";
import { ObraSocial } from "../obraSocial/obrasocial.entity.js";
import { Turno } from "../turno/turno.entity.js";
import { esEmailValido } from "../utils/validarEmail.js";
import { esContraseniaValida } from "../utils/validarContrasenia.js";
import jwt from "jsonwebtoken";


const em = orm.em.fork();


//funcion para generar el token
function generarToken(paciente: Paciente) {
  const payload = {
    id: paciente.id,
    role: paciente.role || "paciente",
  };
  // Usa JWT_SECRET del .env, y si no existe, una de desarrollo
  const secret = process.env.JWT_SECRET || "dev-secret";

  // El token vence en 1 hora (podés ajustar)
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}


async function register(req: Request, res: Response) {
  const { nombre, apellido, email, password, obraSocialId, role } = req.body;
  // Log de los datos recibidos
  console.log("Datos recibidos en /register:", req.body);
  //console.log('Datos recibidos:', req.body);
  try {
    // Validar los campos obligatorios
    if (!nombre || !apellido || !email || !password || !obraSocialId) {
      return res
        .status(400)
        .json({
          message:
            "Nombre, apellido, email, contraseña y obra social son obligatorios.",
        });
    }

    console.log("DEBUG esEmailValido(email):", esEmailValido(email));

    //valida formato del email
    if (!esEmailValido(email)) {
      return res
        .status(400)
        .json({ message: "El email no tiene un formato válido." });
    }

     if (!esContraseniaValida(password)) {
      return res.status(400).json({
        message:
          "La contraseña no es válida. Debe tener al menos 8 caracteres e incluir letras y números.",
      });
    }

    //  Verificar si ya existe un paciente con el mismo email
    const existingPaciente = await em.findOne(Paciente, { email });
    if (existingPaciente) {
      return res.status(400).json({ message: "El email ya está en uso." });
    }

    //  Verificar si la obra social existe
    const obraSocial = await em.findOne(ObraSocial, { id: obraSocialId });
    if (!obraSocial) {
      return res
        .status(404)
        .json({ message: "La obra social proporcionada no existe." });
    }

    //  Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    //  Crear el nuevo paciente, asegurándose de que obraSocial es obligatoria
    const paciente = em.create(Paciente, {
      nombre,
      apellido,
      email,
      passwordHash,
      obraSocial,
      role: role || "paciente", // Se pasa la obra social validada
    });

    
    // 6. Persistir el paciente en la base de datos
    await em.persistAndFlush(paciente);

      const token = generarToken(paciente);

      const pacienteDTO = {
      id: paciente.id,
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      email: paciente.email,
      role: paciente.role || "paciente",
      obraSocial: paciente.obraSocial?.id ?? null,
      token,
    };

    // 7. Enviar la respuesta de éxito
    res
      .status(201)
      .json({ message: "Paciente registrado exitosamente", data: pacienteDTO, });
  } catch (error: any) {
    // Manejar cualquier error
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
}

async function login(req: Request, res: Response) {
  const { email, password } = req.body; // Cambiado a 'email'

  try {
    // Validar que el email y la contraseña estén presentes
    if (!email || !password) {
      console.log("Error: Email y contraseña son obligatorios");
      return res
        .status(400)
        .json({ message: "Email y contraseña son obligatorios" });
    }

    // Buscar el usuario en la base de datos por email
    const usuario = await em.findOne(Paciente, { email });
    if (!usuario) {
      console.log(`Error: Credenciales inválidas para Email: ${email}`);
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Comparar la contraseña proporcionada con el hash almacenado
    const isMatch = await bcrypt.compare(password, usuario.passwordHash);
    if (!isMatch) {
      console.log(`Error: Contraseña incorrecta para Email: ${email}`);
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    
    console.log(`Login exitoso para Email: ${email}`);

    // generar el token JWT
    const token = generarToken(usuario);

    const pacienteDTO = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      role: usuario.role || "paciente",
      telefono: (usuario as any).telefono ?? null,
      obraSocial: (usuario as any).obraSocial ?? null,
     
    };

    res.status(200).json({ message: "Login exitoso",data: pacienteDTO, token,});
  } catch (error: any) {
    console.error("Error en el proceso de login:", error.message); // Imprimir error en la consola
    res.status(500).json({ message: error.message });
  }
} 

async function findAll(req: Request, res: Response) {
  try {
    const pacientes = await em.find(
      Paciente,
      {},
      { populate: ["obraSocial", "turnos"] }
    );
    res.status(200).json({ message: "ok", data: pacientes });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const medico = await em.findOneOrFail(
      Paciente,
      { id },
      { populate: ["turnos", "obraSocial"] }
    );
    res.status(200).json({ message: "ok", data: medico });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const pacienteToUpdate = await em.findOneOrFail(Paciente, { id });

    // Si se envía obraSocial como ID, buscarla
    const data = req.body;
    if (
      data.obraSocial &&
      typeof data.obraSocial === "object" &&
      data.obraSocial.id
    ) {
      data.obraSocial = await em.findOneOrFail(ObraSocial, {
        id: data.obraSocial.id,
      });
    }

    em.assign(pacienteToUpdate, data);
    await em.flush();

    res
      .status(200)
      .json({ message: "Paciente actualizado", data: pacienteToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    // Convertir el ID a número
    const id = Number.parseInt(req.params.id);

    // Asegúrate de obtener al paciente completo desde la base de datos
    const paciente = await em.findOne(Paciente, { id });

    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" }); // Si el paciente no existe
    }

    // Eliminar el paciente encontrado
    await em.removeAndFlush(paciente);

    res.status(200).json({ message: "Paciente eliminado con éxito" }); // Respuesta exitosa
  } catch (error: any) {
    console.error("Error al eliminar el paciente:", error); // Log para depuración
    res
      .status(500)
      .json({ message: "Error al eliminar el paciente", error: error.message }); // Respuesta de error
  }
}

// Nuevo método para obtener los turnos del paciente usando el id como parámetro
async function findTurnosByPacienteId(req: Request, res: Response) {
  try {
    // Obtener el ID del paciente desde los parámetros de la URL
    const pacienteId = Number.parseInt(req.params.id);

    if (isNaN(pacienteId)) {
      return res.status(400).json({ message: "ID de paciente inválido" });
    }

    // Buscar los turnos del paciente usando su ID
    const turnos = await em.find(
      Turno,
      { paciente: pacienteId },
      { populate: ["paciente", "medico"] }
    );

    if (turnos.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron turnos para este paciente" });
    }

    res
      .status(200)
      .json({ message: "Turnos obtenidos con éxito", data: turnos });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener los turnos", error: error.message });
  }
}

export {
  login,
  register,
  remove,
  update,
  findOne,
  findAll,
  findTurnosByPacienteId,
};
