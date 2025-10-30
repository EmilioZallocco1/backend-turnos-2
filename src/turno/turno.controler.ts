import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Turno } from './turno.entity.js'
import { Medico } from '../medico/medico.entity.js'
import { Paciente } from '../paciente/paciente.entity.js'
import { intervalsOverlap, startOfDayUTC, endOfDayUTC, combineDateAndTime, addMinutes } from '../utils/turnos.helpers.js';

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
    const DURACION_MIN = 30; // duración fija de cada turno en minutos

    // Buscar médico y paciente
    const medico = await em.findOne(Medico, { id: medicoId });
    if (!medico) return res.status(400).json({ message: 'Médico no encontrado' });

    const paciente = await em.findOne(Paciente, { id: pacienteId });
    if (!paciente) return res.status(400).json({ message: 'Paciente no encontrado' });

    // Combinar fecha + hora
    const inicio = new Date(`${fecha}T${hora}`);
    const fin = new Date(inicio.getTime() + DURACION_MIN * 60 * 1000);

    // Buscar turnos existentes del mismo médico (podés filtrar por día si querés optimizar)
    const turnosExistentes = await em.find(Turno, { medico: medicoId });

    // Verificar superposición
    const haySuperposicion = turnosExistentes.some(t => {
      const tInicio = new Date(`${t.fecha.toISOString().split('T')[0]}T${t.hora}`);
      const tFin = new Date(tInicio.getTime() + DURACION_MIN * 60 * 1000);
      return inicio < tFin && fin > tInicio;
    });

    if (haySuperposicion) {
      return res.status(409).json({
        message: 'El turno se superpone con otro del mismo médico',
      });
    }

    // Crear y guardar turno
    const turno = em.create(Turno, {
      fecha: new Date(fecha),
      hora: String(hora),
      estado: String(estado),
      descripcion: String(descripcion),
      medico,
      paciente,
    });

    await em.flush();

    res.status(201).json({ message: 'Turno creado correctamente', data: turno });
    console.log('Turno creado:', turno);
  } catch (error: any) {
    console.error('Error al crear turno:', error);
    res.status(500).json({ message: error.message });
  }
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


//SOLAPAMIENTO DE TURNOS


async function checkOverlap(req: Request, res: Response) {
  try {
    const medicoId = Number(req.params.id);
    const { inicio, fin, duracionMin } = req.query as { inicio?: string; fin?: string; duracionMin?: string; };

    if (isNaN(medicoId)) return res.status(400).json({ message: 'ID de médico inválido' });

    // Si no mandan fin, calculamos con duracionMin (default 30)
    const dur = Number(duracionMin ?? 30);
    if (!inicio && !fin) return res.status(400).json({ message: 'Parámetros inválidos: enviar inicio y fin o inicio+duracionMin' });

    const ini = inicio ? new Date(inicio) : undefined;
    const fi  = fin    ? new Date(fin)    : (ini ? addMinutes(ini, dur) : undefined);
    if (!ini || !fi) return res.status(400).json({ message: 'Fechas inválidas' });

    // Traigo turnos del mismo día del médico para chequear en memoria
    const dayStart = startOfDayUTC(ini);
    const dayEnd   = endOfDayUTC(ini);

    const turnos = await em.find(Turno, { 
      medico: medicoId,
      fecha: { $gte: dayStart, $lte: dayEnd }
    });

    const overlap = turnos.some(t => {
      const tIni = combineDateAndTime(t.fecha, t.hora);
      const tDur = (t as any).duracionMin ?? 30; // si no tenés el campo, usa default 30
      const tFin = addMinutes(tIni, tDur);
      return intervalsOverlap(ini, fi, tIni, tFin);
    });

    return res.status(200).json({ overlap });
  } catch (error:any) {
    console.error('checkOverlap error', error);
    res.status(500).json({ message: error.message });
  }
}



export { add, remove, update, findOne, findAll,findTurnosByMedico,checkOverlap }