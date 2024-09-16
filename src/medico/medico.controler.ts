import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Medico } from './medico.entity.js'

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
    
    try {
        const medico = em.create(Medico, req.body)
        await em.flush()
        res.status(201).json({message: 'ok', data: medico})
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




export { add, remove, update, findOne, findAll }