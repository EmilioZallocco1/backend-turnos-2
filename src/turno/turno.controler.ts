import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Turno } from './turno.entity.js'
import { Medico } from '../medico/medico.entity.js'
import { Paciente } from '../paciente/paciente.entity.js'

const em = orm.em

async function findAll(req: Request,res: Response) {
    try{
        const turnos = await em.find(Turno, {},{ populate: ['paciente', 'medico'] })
        res.status(200).json({message: 'ok', data: turnos})
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}


async function findOne(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const medico = await em.findOneOrFail(Turno, { id },{ populate: ['medico','paciente'] })
        res.status(200).json({message: 'ok', data: medico})

    }catch (error:any) {
        res.status(500).json({ message: error.message })
    }
    
}

async function add(req: Request, res: Response) {
  try {
    const { fecha, hora, estado, descripcion, medicoId, pacienteId } = req.body;

    // Buscar el Medico con el medicoId
    const medico = await em.findOne(Medico, { id: medicoId });
    if (!medico) {
      return res.status(400).json({ message: 'Medico no encontrado' });
    }

    // Buscar el Paciente con el pacienteId
    const paciente = await em.findOne(Paciente, { id: pacienteId });
    if (!paciente) {
      return res.status(400).json({ message: 'Paciente no encontrado' });
    }

    // Crear el turno con los objetos Medico y Paciente
    const turno = em.create(Turno, {
      fecha,
      hora,
      estado,
      descripcion,
      medico,  // Asigna el objeto Medico
      paciente  // Asigna el objeto Paciente
    });

    await em.flush();
    res.status(201).json({ message: 'Turno creado', data: turno });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }

  console.log("Datos recibidos para crear el turno:", req.body);
}

async function update(req: Request, res: Response) {
    try {
      const id = Number.parseInt(req.params.id)
      const turnoToUpdate = await em.findOneOrFail(Turno, { id })
      em.assign(turnoToUpdate, req.body.sanitizedInput)
      await em.flush()
      res
        .status(200)
        .json({ message: 'turno updated', data: turnoToUpdate })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }


  async function remove(req: Request, res: Response) {
    try {
      // Convertir el ID a número
      const id = Number.parseInt(req.params.id);
  
      // Asegúrate de obtener el turno completo desde la base de datos
      const turno = await em.findOne(Turno, { id });
  
      if (!turno) {
        return res.status(404).json({ message: 'Turno no encontrado' }); // Si el turno no existe
      }
  
      // Eliminar el turno encontrado
      await em.removeAndFlush(turno);
  
      res.status(200).json({ message: 'Turno eliminado con éxito' }); // Respuesta exitosa
    } catch (error: any) {
      console.error('Error al eliminar el turno:', error); // Log para depuración
      res.status(500).json({ message: 'Error al eliminar el turno', error: error.message }); // Respuesta de error
    }
  }
  
  async function findTurnosByMedico(req: Request, res: Response) {
  try {
    const medicoId = Number(req.params.id);

    if (isNaN(medicoId)) {
      return res.status(400).json({ message: 'ID de médico inválido' });
    }

    const turnos = await em.find(Turno, { medico: medicoId }, { populate: ['paciente', 'medico'] });

    if (!turnos || turnos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron turnos para este médico' });
    }

    res.status(200).json({ message: 'Turnos del médico obtenidos con éxito', data: turnos });
  } catch (error: any) {
    console.error('Error al obtener turnos del médico:', error);
    res.status(500).json({ message: 'Error interno', error: error.message });
  }
}





export { add, remove, update, findOne, findAll,findTurnosByMedico }