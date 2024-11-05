import { Router } from 'express'
import {
  findAll,
  findOne,
  update,
  remove,
  register,
  login
} from '../paciente/paciente.controler.js'

export const pacienteRouter = Router()

pacienteRouter.get('/', findAll)
pacienteRouter.get('/:id', findOne)
//pacienteRouter.post('/', add)
pacienteRouter.put('/:id', update)
pacienteRouter.delete('/:id', remove)
pacienteRouter.post('/register', register)
pacienteRouter.post('/login', login)
