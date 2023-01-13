import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import usersRoutes from './routes/accounts.js';

const app = express();
const PORT = 5000;

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
