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
  hora!: string; // Hora como string (formato HH:mm), puedes usar otro tipo si prefieres manejar tiempos de otra manera


  @Property()
  estado!: string; // Estado del turno (Pendiente, Confirmado, Cancelado, etc.)

  @Property()
  descripcion!: string; // Descripción del turno (motivo de la consulta, diagnostico, etc.)

  // turno.entity.ts
  //@Property()
  //duracionMin!: number; // p.ej. 30


  @ManyToOne (()=>Medico,{nullable:false}) // Relaciona con la entidad Medico 1 a N
  medico !: Rel<Medico>

  @ManyToOne (()=>Paciente,{nullable:false}) // Relaciona con la entidad Paciente 1 a N
  paciente !: Rel<Paciente>



}
