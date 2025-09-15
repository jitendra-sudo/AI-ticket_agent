import {userSignup, userLogin, logout, UserUpdate, getUsers } from '../Controller/user.js';
import express from 'express';
import Authorization from '../Middleware/auth.js';

const router = express.Router();
router.post('/register', userSignup )
router.post('/login', userLogin )
router.post('/logout', logout )
router.put('/update', Authorization, UserUpdate )
router.get('/all',Authorization, getUsers )

export default router;