import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Paciente } from './paciente.entity.js'

const em = orm.em
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

async function add(req: Request, res: Response) {
    
    try {
        const paciente = em.create(Paciente, req.body)
        await em.flush()
        res.status(201).json({message: 'ok', data: paciente})
    }   catch (error:any) {
        res.status(500).json({ message: error.message })
    }
    
}


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






export { add, remove, update, findOne, findAll }