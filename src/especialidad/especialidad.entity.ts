import { Collection, Entity, OneToMany, Property, PrimaryKey, Cascade } from '@mikro-orm/core'
import { Medico } from '../medico/medico.entity.js'

@Entity()
export class Especialidad {

    @PrimaryKey()
    id!: number

    @Property()
    nombre!: string

    @OneToMany(()=> Medico, (medico) => medico.especialidad,{cascade: [Cascade.ALL],})
    medicos = new Collection<Medico>(this)
}