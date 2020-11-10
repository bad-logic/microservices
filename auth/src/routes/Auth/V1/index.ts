import express from 'express';
import {currentUserRouter} from './current-user';
import {signInRouter} from './signin';
import {signOutRouter} from './signout';
import {signUpRouter} from './signup';
const router = express.Router();

// /api/auth/v1/current-user
router.use('/current-user',currentUserRouter);

// /api/auth/v1/sign-in
router.use('/sign-in',signInRouter);

// /api/auth/v1/sign-out
router.use('/sign-out',signOutRouter);

// /api/auth/v1/sign-up
router.use('/sign-up',signUpRouter);


export {router as v1Router};