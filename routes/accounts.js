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

router.get('/', getUsers);

router.post('/register', createUser);

router.post('/login', loginUser);

router.get('/:id', getUser);

router.delete('/:id', deleteUser);

router.patch('/:id', updateUser);

export default router;
