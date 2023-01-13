import { v4 as uuidv4 } from 'uuid';
import { createRequire } from 'module';
import CryptoJS from 'crypto-js';
import mysql from 'mysql';
import { hasUncaughtExceptionCaptureCallback } from 'process';

const require = createRequire(import.meta.url);
const uuid = require('uuid');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  database: 'accounts',
  user: 'root',
  password: null,
});

export const getUsers = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(118).json({ error: err });
    }

    connection.query('SELECT user_name FROM user_data', (err, rows) => {
      connection.release();
      if (!err) {
        res.send(rows);
      } else {
        res.status(400).json({ error: err });
      }
    });
  });
};

export const loginUser = (req, res) => {
  const user = req.body;
  const raw = CryptoJS.HmacSHA256(
    JSON.stringify(user.name),
    JSON.stringify(user.password),
  );
  const hash = CryptoJS.enc.Base64.stringify(raw);
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(118).json({ error: err });
    }
    connection.query(
      'SELECT 1 FROM user_data WHERE hash = ?',
      hash,
      (err, rows) => {
        connection.release();
        if (!err) {
          if (rows.length >= 1) {
            res.send('OK');
          } else {
            res.status(401).send('NO');
          }
        } else {
          res.status(400).json({ error: err });
        }
      },
    );
  });
};

export const createUser = (req, res) => {
  const user = req.body;
  if (user.name == undefined || user.email == undefined) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }
  const raw = CryptoJS.HmacSHA256(
    JSON.stringify(user.name),
    JSON.stringify(user.password),
  );
  const hash = CryptoJS.enc.Base64.stringify(raw);
  const user_name = user.name;
  const email = user.email;
  const id = uuidv4();
  const setter = { id, hash, user_name, email };
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(118).json({ error: err });
    }
    connection.query('INSERT INTO user_data SET ?', setter, (err, rows) => {
      connection.release();

      if (!err) {
        res.send(`User [${user_name}] added to the database.`);
      } else {
        res.status(400).json({ error: err });
      }
    });
  });
};

export const getUser = (req, res) => {
  if (!uuid.validate(req.params.id)) {
    res.status(422).json({ error: 'Invalid id format' });
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(118).json({ error: err });
    }

    connection.query(
      'SELECT user_name FROM user_data WHERE id = ?',
      [req.params.id],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.send(rows);
        } else {
          res.status(400).json({ error: err });
        }
      },
    );
  });
};

export const deleteUser = (req, res) => {
  if (!uuid.validate(req.params.id)) {
    res.status(422).json({ error: 'Invalid id format' });
    return;
  }
  const user = req.body;

  const raw = CryptoJS.HmacSHA256(
    JSON.stringify(user.name),
    JSON.stringify(user.password),
  );
  const hash = CryptoJS.enc.Base64.stringify(raw);
  pool.getConnection(async (err, connection) => {
    if (err) {
      res.status(118).json({ error: err });
    }
    connection.query(
      'SELECT 1 FROM user_data WHERE hash = ?',
      hash,
      (err, rows) => {
        if (!err) {
          if (rows.length >= 1) {
            connection.query(
              'DELETE FROM user_data WHERE id = ?',
              [req.params.id],
              (err, rows) => {
                connection.release();
                if (!err) {
                  res.send('OK');
                } else {
                  res.status(400).send(err);
                  return;
                }
              },
            );
          } else {
            res.status(401).send('Invalid credentials');
          }
        } else {
          res.status(400).send('Error');
          return;
        }
      },
    );
  });
};

export const updateUser = (req, res) => {
  if (!uuid.validate(req.params.id)) {
    res.status(422).json({ error: 'Invalid id format' });
    return;
  }
  const user = req.body;
  const raw = CryptoJS.HmacSHA256(
    JSON.stringify(user.name),
    JSON.stringify(user.password),
  );
  const hash = CryptoJS.enc.Base64.stringify(raw);
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(118).json({ error: err });
    }
    connection.query(
      'SELECT 1 FROM user_data WHERE hash = ?',
      hash,
      (err, rows) => {
        if (!err) {
          if (rows.length >= 1) {
            connection.query(
              `UPDATE user_data SET email = ? WHERE id = ${JSON.stringify(
                req.params.id,
              )}`,
              [user.newemail],
              (err, rows) => {
                connection.release();
                if (rows.length == 0) {
                  res.status(204).json({ error: 'No content' });
                }
                if (!err) {
                  res.send('OK');
                } else {
                  res.status(400).json({ error: err });
                }
              },
            );
          } else {
            res.status(401).send('Invalid credentials');
          }
        } else {
          res.status(400).json({ error: err });
          return;
        }
      },
    );
  });
};
