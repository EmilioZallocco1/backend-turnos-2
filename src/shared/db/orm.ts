import { MikroORM } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

// nombre de BD: viene por env, si no, usa el local por defecto
const dbName = process.env.DB_NAME ?? 'dswturnos';

// URL de conexión completa (MySQL):
//  - En Render: la vas a poner en DB_URL (mysql://usuario:pass@host:puerto/bd)
//  - En tu PC: sigue usando localhost si no hay DB_URL
const clientUrl =
  process.env.DB_URL ?? 'mysql://root:4406@localhost:3306/dswturnos';

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName,
  type: 'mysql',
  clientUrl,
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    // nunca hagas dropSchema en producción
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();
  // ¡ojo con esto en producción!
  // await generator.dropSchema();
  // await generator.createSchema();
  await generator.updateSchema();
};
