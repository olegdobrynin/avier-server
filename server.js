#!/usr/bin/env node

import app from './src/app.js';
import sequelize from './src/db/db.js';

const port = process.env.PORT ?? 5000;

app.listen({ port }, async (err, address) => {
  if (err) {
    throw err;
  }
  console.log(`Server up on ${address}`); // eslint-disable-line no-console
  await sequelize.authenticate();
  console.log('Database connected!'); // eslint-disable-line no-console
});
