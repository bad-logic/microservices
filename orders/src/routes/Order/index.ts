import {v1Router} from './V1';
import express from 'express';

const router = express.Router();

// /api/order/v1
router.use('/v1',v1Router);




export {router as orderRouter}