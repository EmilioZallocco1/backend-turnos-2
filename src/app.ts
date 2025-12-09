import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { especialidadRouter } from './especialidad/especialidad.routes.js'
import { medicoRouter } from './medico/medico.routes.js'
import { turnoRouter } from './turno/turno.routes.js'
import { pacienteRouter } from './paciente/paciente.routes.js'
import { obraSocialRouter } from './obraSocial/obraSocial.routes.js'

const app = express()

app.use(express.json())
app.use(cors())

// Contexto de MikroORM por request
app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

// Rutas
app.use('/api/especialidades/', especialidadRouter)
app.use('/api/medicos/', medicoRouter)
app.use('/api/turnos/', turnoRouter)
app.use('/api/pacientes/', pacienteRouter)
app.use('/api/obras-sociales/', obraSocialRouter)

// 404
app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

//  NUNCA correr syncSchema en producción
if (process.env.NODE_ENV !== 'production') {
  await syncSchema()
}

// Puerto dinámico para Render
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`)
})
