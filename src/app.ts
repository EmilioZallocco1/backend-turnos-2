import 'reflect-metadata'
import express from 'express'
// import { characterRouter } from './character/character.routes.js'
// import { characterClassRouter } from './character/characterClass.routes.js'
// import { itemRouter } from './character/item.routes.js'
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { especialidadRouter } from './especialidad/especialidad.routes.js'
import { medicoRouter } from './medico/medico.routes.js'
import { turnoRouter } from './turno/turno.routes.js'
import { pacienteRouter } from './paciente/paciente.routes.js'
import { obraSocialRouter} from './obraSocial/obraSocial.routes.js'



const app = express()
app.use(express.json())

//luego de los middlewares base
app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})
//antes de las rutas y middlewares de negocio


//==================================================================
// app.use('/api/characters/classes', characterClassRouter)
// app.use('/api/characters', characterRouter)
// app.use('/api/items', itemRouter)

app.use('/api/especialidades/',especialidadRouter)
app.use('/api/medicos/', medicoRouter)
app.use('/api/turnos/', turnoRouter)
app.use('/api/pacientes/', pacienteRouter)
app.use('/api/obrasSociales/', obraSocialRouter)

//===================================================================

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

await syncSchema() //never in production

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})
