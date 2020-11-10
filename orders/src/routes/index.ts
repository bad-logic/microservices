import {orderRouter} from './Order';
import express from 'express';

const router = express.Router();

// /api/order
router.use('/order',orderRouter);




export {router as RouteHandlers}