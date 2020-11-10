import express,{Request,Response,NextFunction} from 'express';
import {UserRepo} from '../../../db/repo/userRepo';
import {JWT} from '../../../lib/jwt/jwt';
import {Password} from '../../../lib/password/password';
import {validate} from '@rbtickets/sharedlib';
import Joi from 'joi';

const router = express.Router();


const signUpValidationSchema = Joi.object().keys({
    username: Joi.string().min(4).max(10).required().trim().custom((value,helpers)=> value[0].toUpperCase()+value.slice(1).toLowerCase(),'capitalizing the username'),
    email: Joi.string().email().required().trim().lowercase(),
    password: Joi.string().alphanum().min(6).max(20).required().trim(),
    confirmPassword: Joi.ref('password')
});

// POST /api/auth/v1/sign-up
router.post('/',validate(signUpValidationSchema),async (req:Request,res:Response,next:NextFunction)=>{
    try{

        const value = req.validData;

        const hashedPassword = await (new Password(value.password).encrypt());

        const result = await UserRepo.addUser(value.email,value.username,hashedPassword);

        const formattedResult = UserRepo.mapDocToObj(result);

        const token =  await JWT.generateJWT({username:formattedResult.username,email:formattedResult.email,id:formattedResult.id});

        // store jwt in the session object created by cookie-session
        // which will serialize it sent it to the users browser
        // and browser will send it back on every request to the server
        req.session = {
            jwt: token
        };
        
        res.status(201).send({message:'user created',user:formattedResult});
    }catch(err){
        next(err);
    }
});


export {router as signUpRouter};