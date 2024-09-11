import {Entity,PrimaryKey,Property,OneToMany,Collection,ManyToOne, Rel} from '@mikro-orm/core';
import { Especialidad } from '../especialidad/especialidad.entity.js';
import { Turno } from '../turno/turno.entity.js';
import { ObraSocial } from '../obraSocial/obrasocial.entity.js';
//import { Horario } from './Horario'; // Importa la entidad Horario

@Entity()
export class Medico {
  @PrimaryKey()
  id!: number;

  @Property()
  nombre!: string;

  @ManyToOne(()=> Especialidad,{nullable:false})
  especialidad!: Rel<Especialidad>

  @Property()
  email!: string;

  @Property()
  telefono!: string;

  @ManyToOne(()=> ObraSocial,{nullable:false})
  obraSocial!: Rel<ObraSocial>

  @OneToMany(() => Turno, (turno) => turno.medico)
  turnos = new Collection<Turno>(this);


//   @OneToMany(() => Horario, (horario) => horario.medico)
//   horarios = new Collection<Horario>(this);

//   @OneToMany(() => Turno, (turno) => turno.medico)
//   turnos = new Collection<Turno>(this);


}