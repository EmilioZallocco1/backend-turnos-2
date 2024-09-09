import { Entity, PrimaryKey, Property, OneToMany, Collection, ManyToOne, Rel, Cascade } from '@mikro-orm/core';
import { Turno } from '../turno/turno.entity.js';
import { ObraSocial } from '../obraSocial/obrasocial.entity.js';
@Entity()
export class Paciente {

  @PrimaryKey()
  id!: number;

  @Property()
  nombre!: string;

  @Property()
  fechaNacimiento!: Date;

  @Property()
  email!: string;

  @Property()
  telefono!: string;

  @ManyToOne(()=>ObraSocial,{nullable:false})
  obraSocial!: Rel<ObraSocial>;

  @OneToMany(()=>Turno,turno=>turno.paciente,{cascade: [Cascade.ALL]})
  turnos = new Collection<Turno>(this);

}
