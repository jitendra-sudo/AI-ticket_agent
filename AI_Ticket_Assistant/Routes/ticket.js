import express from 'express';
import Authorization from '../Middleware/auth.js';
import { createTicket , getTicket, getTickets } from '../Controller/ticket.js';

const router = express.Router();

router.post("/", Authorization, getTickets) 
router.get("/:id", Authorization, getTicket)
router.post("/create", Authorization, createTicket)

export default router;