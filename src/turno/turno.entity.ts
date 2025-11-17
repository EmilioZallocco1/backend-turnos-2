import { Entity, PrimaryKey, Property, ManyToOne, Rel } from '@mikro-orm/core';
import { Medico } from '../medico/medico.entity.js';
import { Paciente } from '../paciente/paciente.entity.js';

@Entity()
export class Turno {
  @PrimaryKey()
  id!: number;

  @Property()
  fecha!: Date;

  @Property()
  hora!: string; 


  @Property()
  estado!: string; // Estado del turno (Pendiente, Confirmado, Cancelado, etc.)

  @Property()
  descripcion!: string; 
  // turno.entity.ts
  //@Property()
  //duracionMin!: number; // p.ej. 30


  @ManyToOne (()=>Medico,{nullable:false}) 
  medico !: Rel<Medico>

  @ManyToOne (()=>Paciente,{nullable:false}) 
  paciente !: Rel<Paciente>



}
