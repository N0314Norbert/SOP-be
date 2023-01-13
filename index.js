import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import { createRequire } from 'module';
import usersRoutes from './routes/accounts.js';

const require = createRequire(import.meta.url);
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 5000;

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'SOP API',
      servers: ['http://localhost:5000'],
    },
  },
  apis: ['./controllers/*js', './routes/*js'],
};

const swaggerDoc = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: '*',
  }),
);
app.use('/users', usersRoutes);
app.all('*', (req, res) => {
  res.status(400).json({ error: 'You have tried a route that does not exist' });
});
app.use;

app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`),
);
