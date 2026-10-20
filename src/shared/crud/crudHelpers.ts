import type { EntityManager, EntityName, FilterQuery } from "@mikro-orm/core";
import { ConflictError, NotFoundAppError } from "../errors/appError.js";

// `options` se deja como `any`: estos helpers son un detalle de implementación
// interno, y los tipos de `populate`/`orderBy` de MikroORM no se infieren bien
// a traves de un generico de este tipo.
export async function findPaginated<T extends object>(
  em: EntityManager,
  entityName: EntityName<T>,
  where: FilterQuery<T>,
  limit: number,
  offset: number,
  options?: Record<string, any>,
) {
  const [items, total] = await em.findAndCount(entityName, where, {
    ...options,
    limit,
    offset,
    orderBy: options?.orderBy ?? { id: "ASC" },
  } as any);

  return { items, total };
}

export async function findOneOrNotFound<T extends object>(
  em: EntityManager,
  entityName: EntityName<T>,
  where: FilterQuery<T>,
  notFoundMessage: string,
  options?: Record<string, any>,
) {
  const entity = await em.findOne(entityName, where, options as any);

  if (!entity) {
    throw new NotFoundAppError(notFoundMessage);
  }

  return entity;
}

export async function assertUnique<T extends object>(
  em: EntityManager,
  entityName: EntityName<T>,
  where: FilterQuery<T>,
  conflictMessage: string,
) {
  const existing = await em.findOne(entityName, where);

  if (existing) {
    throw new ConflictError(conflictMessage);
  }
}
