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
  apellido!: string;

  @Property()
  email!: string;

  @Property()
  passwordHash!: string; // Asegúrate de que esta propiedad esté definida
  
  @Property()
  role: string = 'paciente'; // Rol por defecto, establecido como 'paciente'

  @ManyToOne(()=>ObraSocial,{nullable:false})
  obraSocial?: Rel<ObraSocial>;

  @OneToMany(()=>Turno,turno=>turno.paciente,{cascade: [Cascade.ALL]})
  turnos = new Collection<Turno>(this);

}
