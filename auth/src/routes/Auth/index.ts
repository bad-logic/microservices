import express from 'express';
import {v1Router} from './V1';
const router = express.Router();

// /api/auth/v1
router.use('/v1',v1Router);


export {router as authRouter};