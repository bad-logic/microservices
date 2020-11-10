import {newOrderRouter} from './new-order';
import {getOrderRouter} from './get-order';
import {getOrdersRouter} from './get-orders';
import {cancelOrderRouter} from './cancel-order';

import express from 'express';

const router = express.Router();

// /api/order/v1/new-order
router.use('/new-order',newOrderRouter);

// /api/order/v1/get-order
router.use('/get-order',getOrderRouter);

// /api/order/v1/get-orders
router.use('/get-orders',getOrdersRouter);

// /api/order/v1/cancel-order
router.use('/cancel-order',cancelOrderRouter);

export {router as v1Router}