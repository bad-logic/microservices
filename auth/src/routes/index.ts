import express from 'express';
import {authRouter} from './Auth';

const router = express.Router();

// /api/auth
router.use('/auth',authRouter);


export {router as RouterHandlers};