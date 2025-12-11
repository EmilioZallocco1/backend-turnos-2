import { Router } from 'express'
import { authMiddleware } from '../auth/auth.middleware.js' 
import {
  findAll,
  findOne,
  update,
  remove,
  register,
  login,
  findTurnosByPacienteId
} from '../paciente/paciente.controler.js'

export const pacienteRouter = Router()


// Login y register son públicos
pacienteRouter.post('/login', login)
pacienteRouter.post('/register', register)


//  Todas las rutas de abajo requieren JWT válido
pacienteRouter.use(authMiddleware);
pacienteRouter.get('/', findAll)
pacienteRouter.get('/:id', findOne)
pacienteRouter.put('/:id', update)
pacienteRouter.delete('/:id', remove)
pacienteRouter.get('/:id/turnos', findTurnosByPacienteId)
