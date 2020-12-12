import express from 'express';
import {paymentRouter} from './payments';


const router = express.Router();

// POST /api/payments
router.use('/payments',paymentRouter);

export {router as RouteHandlers};



