import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  ManyToOne,
  Rel,
  Cascade,
} from '@mikro-orm/core';
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
  passwordHash!: string;

  @Property()
  role: string = 'paciente';

  @Property({ nullable: true }) // 
  telefono?: string;

  @ManyToOne(() => ObraSocial, { nullable: false })
  obraSocial?: Rel<ObraSocial>;

  @OneToMany(() => Turno, turno => turno.paciente, { cascade: [Cascade.ALL] })
  turnos = new Collection<Turno>(this);
}
