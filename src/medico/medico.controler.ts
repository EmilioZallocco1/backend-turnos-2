import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Medico } from './medico.entity.js'
import { Turno } from '../turno/turno.entity.js'

const em = orm.em

async function findAll(req: Request,res: Response) {
    try{
        const medicos = await em.find(Medico, {},{ populate: ['especialidad'] })
        res.status(200).json({message: 'ok', data: medicos})
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}


async function findOne(req: Request, res: Response) {
    try{
        const id = Number.parseInt(req.params.id)
        const medico = await em.findOneOrFail(Medico, { id },{ populate: ['especialidad'] })
        res.status(200).json({message: 'ok', data: medico})

    }catch (error:any) {
        res.status(500).json({ message: error.message })
    }
    
}

async function add(req: Request, res: Response) {
  console.log('Body recibido:', req.body);

  try {
    const { nombre, email, telefono, especialidad, obraSocial } = req.body;

    if (!especialidad?.id) {
      return res.status(400).json({ message: 'Falta el ID de la especialidad' });
    }

    const especialidadObj = await em.findOneOrFail('Especialidad', { id: especialidad.id });

    let obraSocialObj = null;
    if (obraSocial?.id) {
      obraSocialObj = await em.findOne('ObraSocial', { id: obraSocial.id });
    }

    // Construir los datos del médico
    const datosMedico: any = {
      nombre,
      email,
      telefono,
      especialidad: especialidadObj,
    };

    if (obraSocialObj) {
      datosMedico.obraSocial = obraSocialObj;
    }

    const medico = em.create(Medico, datosMedico);
    await em.flush();

    res.status(201).json({ message: 'ok', data: medico });

  } catch (error: any) {
    console.error('Error al registrar médico:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
}



 async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)

    // 1) Verificar que exista
    const medico = await em.findOne(Medico, { id })
    if (!medico) return res.status(404).json({ message: 'Médico no encontrado' })

    // 2) Bloquear si tiene turnos asociados
    const turnosAsociados = await em.count(Turno, { medico: medico })
    if (turnosAsociados > 0) {
      return res.status(409).json({
        message: `No se puede eliminar: tiene ${turnosAsociados} turno(s) asociado(s).`
      })
    }

    // 3) Eliminar
    await em.removeAndFlush(medico)
    return res.status(204).send()
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
    console.log('Body recibido para update:', req.body);

    try {
      const id = Number.parseInt(req.params.id)
      const medicoToUpdate = await em.findOneOrFail(Medico, { id })
      em.assign(medicoToUpdate, req.body.sanitizedInput)
      await em.flush()
      res
        .status(200)
        .json({ message: 'medico updated', data: medicoToUpdate })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }



export { add, remove, update, findOne, findAll }