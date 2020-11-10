import {newTicketRouter} from './new-ticket';
import {getTicketRouter} from './get-ticket';
import {getTicketsRouter} from './get-tickets';
import {editTicketRouter} from './edit-ticket';

import express from 'express';

const router = express.Router();

// /api/ticket/v1/new-ticket
router.use('/new-ticket',newTicketRouter);

// /api/ticket/v1/get-ticket
router.use('/get-ticket',getTicketRouter);

// /api/ticket/v1/get-tickets
router.use('/get-tickets',getTicketsRouter);

// /api/ticket/v1/edit-tickets
router.use('/edit-ticket',editTicketRouter);

export {router as v1Router}