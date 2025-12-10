// mikro-orm.config.js - config para el CLI (ESM)

import 'dotenv/config';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

export default {
  entities: ['dist/**/*.entity.js'],      // usa las entidades compiladas
  type: 'mysql',
  clientUrl:
    process.env.DATABASE_URL ??
    'mysql://root:4406@localhost:3306/dswturnos',
  highlighter: new SqlHighlighter(),
  debug: true,
};
