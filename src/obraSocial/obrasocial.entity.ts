import { Collection, Entity, OneToMany, Property, PrimaryKey, Cascade } from '@mikro-orm/core'
import { Medico } from '../medico/medico.entity.js'
import { Paciente } from '../paciente/paciente.entity.js'

@Entity()
export class ObraSocial {
    @PrimaryKey()
    id!: number

    @Property()
    nombre!: string

    @OneToMany (()=> Medico, (medico) => medico.obraSocial, {cascade: [Cascade.ALL]})
    medicos = new Collection<Medico>(this) 

    @OneToMany(()=>Paciente,(paciente)=> paciente.obraSocial,{cascade: [Cascade.ALL]})
    pacientes = new Collection<Paciente>(this)
}

