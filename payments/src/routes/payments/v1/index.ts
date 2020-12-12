import {newPaymentRouter} from './create-payment';
import express from 'express';


const router = express.Router();

// POST api/payments/v1/new-payment
router.use('/new-payment',newPaymentRouter);


export {router as v1Router};