import {ticketRouter} from './Ticket';
import express from 'express';

const router = express.Router();

// /api/ticket
router.use('/ticket',ticketRouter);




export {router as RouteHandlers}