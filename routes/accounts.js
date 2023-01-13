import express from 'express';

import {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
  loginUser,
} from '../controllers/mainController.js';

const router = express.Router();

//Routes
/**
 * @swagger
 * /users:
 *  get:
 *   description: Request all users
 *   responses:
 *     '200':
 *        description: Succesful response
 */
router.get('/', getUsers);

/**
 * @swagger
 * /users:
 *  post:
 *   parameters:
 *    - name: name
 *      in: body
 *    - name: password
 *      in: body
 *    - name: email
 *      in: body
 *   description: Register user
 *   responses:
 *     '200':
 *        description: Succesful registration
 *     '118':
 *        description: Error at connecting to SQL server
 *     '400':
 *        description: Default error message
 */
router.post('/register', createUser);

/**
 * @swagger
 * /users/login:
 *  post:
 *   parameters:
 *    - name: name
 *      in: body
 *    - name: password
 *      in: body
 *   description: Logs in the user
 *   responses:
 *     '200':
 *        description: Succesful login
 *     '118':
 *        description: Error at connecting to SQL server
 *     '400':
 *        description: Default error message
 *     '401':
 *        description: Wrong credentials
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /users/:id:
 *  get:
 *   parameters:
 *     - name: uuid
 *       in: path
 *   description: Request one users by id
 *   responses:
 *     '200':
 *        description: Succesful response
 *     '400':
 *        description: Default error message
 *     '422':
 *        description: Incorrect uuid
 */
router.get('/:id', getUser);

/**
 * @swagger
 * /users/:id:
 *  delete:
 *   parameters:
 *    - name: name
 *      in: body
 *    - name: password
 *      in: body
 *    - name: uuid
 *      in: path
 *   description: Register user
 *   responses:
 *     '200':
 *        description: Succesful delete
 *     '118':
 *        description: Error at connecting to SQL server
 *     '400':
 *        description: Default error message
 *     '422':
 *        description: Incorrect uuid
 *     '401':
 *        description: Incorrect credentials
 */
router.delete('/:id', deleteUser);

/**
 * @swagger
 * /users/:id:
 *  patch:
 *   parameters:
 *    - name: name
 *      in: body
 *    - name: password
 *      in: body
 *    - name: newemail
 *      in: body
 *    - name: uuid
 *      in: path
 *   description: changes a user's email adress
 *   responses:
 *     '200':
 *        description: Succesful patch
 *     '118':
 *        description: Error at connecting to SQL server
 *     '400':
 *        description: Default error message
 *     '422':
 *        description: Incorrect uuid
 *     '401':
 *        description: Incorrect credentials
 */
router.patch('/:id', updateUser);

export default router;
