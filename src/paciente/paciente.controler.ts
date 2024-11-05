import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Paciente } from './paciente.entity.js'
import bcrypt from 'bcrypt';
import { ObraSocial } from '../obraSocial/obrasocial.entity.js';

const em = orm.em.fork();


async function register(req: Request, res: Response) {
  const { nombre, apellido, email, password, obraSocialId } = req.body;
    // Log de los datos recibidos
    //console.log('Datos recibidos:', req.body);
  try {
    // 1. Validar los campos obligatorios
    if (!nombre || !apellido || !email || !password || !obraSocialId) {
      return res.status(400).json({ message: 'Nombre, apellido, email, contraseña y obra social son obligatorios.' });
    }

    // 2. Verificar si ya existe un paciente con el mismo email
    const existingPaciente = await em.findOne(Paciente, { email });
    if (existingPaciente) {
      return res.status(400).json({ message: 'El email ya está en uso.' });
    }

    // 3. Verificar si la obra social existe
    const obraSocial = await em.findOne(ObraSocial, { id: obraSocialId });
    if (!obraSocial) {
      return res.status(404).json({ message: 'La obra social proporcionada no existe.' });
    }

    // 4. Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // 5. Crear el nuevo paciente, asegurándose de que obraSocial es obligatoria
    const paciente = em.create(Paciente, {
      nombre,
      apellido,
      email,
      passwordHash,
      obraSocial,
      role: 'paciente',   // Se pasa la obra social validada
    });

    // 6. Persistir el paciente en la base de datos
    await em.persistAndFlush(paciente);

    // 7. Enviar la respuesta de éxito
    res.status(201).json({ message: 'Paciente registrado exitosamente', data: paciente });
  } catch (error: any) {
    // Manejar cualquier error
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
}






async function login(req: Request, res: Response) {
  const { email, password } = req.body; // Cambiado a 'email'

  try {
    // Validar que el email y la contraseña estén presentes
    if (!email || !password) {
      console.log('Error: Email y contraseña son obligatorios');
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    // Buscar el usuario en la base de datos por email
    const usuario = await em.findOne(Paciente, { email });
    if (!usuario) {
      console.log(`Error: Credenciales inválidas para Email: ${email}`);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Comparar la contraseña proporcionada con el hash almacenado
    const isMatch = await bcrypt.compare(password, usuario.passwordHash);
    if (!isMatch) {
      console.log(`Error: Contraseña incorrecta para Email: ${email}`);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Opcional: generar un token JWT u otro mecanismo de sesión aquí
    console.log(`Login exitoso para Email: ${email}`);
    res.status(200).json({ message: 'Login exitoso', data: usuario });
  } catch (error: any) {
    console.error('Error en el proceso de login:', error.message); // Imprimir error en la consola
    res.status(500).json({ message: error.message });
  }
}


async function findAll(req: Request, res: Response) {
    try{
        const pacientes = await em.find(Paciente, {},{ populate: ['obraSocial','turnos'] })
        res.status(200).json({message: 'ok', data: pacientes})
    } catch (error:any) {
        res.status(500).json({ message: error.message }) 
}}

async function findOne(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const medico = await em.findOneOrFail(Paciente, { id },{ populate: ['turnos','obraSocial'] })
        res.status(200).json({message: 'ok', data: medico})

    }catch (error:any) {
        res.status(500).json({ message: error.message })
    }
    
}

// async function add(req: Request, res: Response) {
    
//     try {
//         const paciente = em.create(Paciente, req.body)
//         await em.flush()
//         res.status(201).json({message: 'ok', data: paciente})
//     }   catch (error:any) {
//         res.status(500).json({ message: error.message })
//     }
    
// }


async function update(req: Request, res: Response) {
    try {
      const id = Number.parseInt(req.params.id)
      const pacienteToUpdate = await em.findOneOrFail(Paciente, { id })
      em.assign(pacienteToUpdate, req.body.sanitizedInput)
      await em.flush()
      res
        .status(200)
        .json({ message: 'paciente updated', data: pacienteToUpdate })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }


  async function remove(req: Request, res: Response) {
    try {
      const id = Number.parseInt(req.params.id)
      const paciente = em.getReference(Paciente, id)
      await em.removeAndFlush(paciente)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

export { login,register, remove, update, findOne, findAll }