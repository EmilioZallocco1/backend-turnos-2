import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Paciente } from './paciente.entity.js'

const em = orm.em
async function findAll(req: Request, res: Response) {
    try{
        const pacientes = await em.find(Paciente, {},{ populate: ['obraSocial'] })
        res.status(200).json({message: 'ok', data: pacientes})
    } catch (error:any) {
        res.status(500).json({ message: error.message }) 
}}

async function add(req: Request, res: Response) {
    
    try {
        const paciente = em.create(Paciente, req.body)
        await em.flush()
        res.status(201).json({message: 'ok', data: paciente})
    }   catch (error:any) {
        res.status(500).json({ message: error.message })
    }
    
}

async function remove(req: Request, res: Response) {
    res.status(500).json({ message: 'not implemented' })
    
}

async function update(req: Request, res: Response) {
    res.status(500).json({ message: 'not implemented' })
    
}

async function findOne(req: Request, res: Response) {
    res.status(500).json({ message: 'not implemented' })
    
}


export { add, remove, update, findOne, findAll }