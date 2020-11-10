import express,{Request,Response,NextFunction} from 'express';
import {BadRequestError,validate} from '@rbtickets/sharedlib';
import {UserRepo} from '../../../db/repo/userRepo';
import {JWT} from '../../../lib/jwt/jwt';
import {Password} from '../../../lib/password/password';
import Joi from 'joi';

const router = express.Router();

const signInValidationSchema = Joi.object().keys({
    email: Joi.string().email().required().trim().lowercase(),
    password: Joi.string().required().trim()
});

// POST /api/auth/v1/sign-in
router.post('/',validate(signInValidationSchema),async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const value = req.validData; 
        const result = await UserRepo.findUserByEmail(value.email);
        if(!result) throw new BadRequestError('Incorrect Email or Password');

        const match = await( new Password(value.password).compare(result.password));
        if(!match) throw new BadRequestError('Incorrect Email or Password');

        const formattedResult = UserRepo.mapDocToObj(result);
        const token =  await JWT.generateJWT({username:formattedResult.username,email:formattedResult.email,id:formattedResult.id});
        
        // store jwt in the session object created by cookie-session
        // which will serialize it sent it to the users browser
        // and browser will send it back on every request to the server
        req.session = {
            jwt: token
        };
        
        res.status(200).send({message:'Signed In successfull',user:formattedResult});
    }catch(err){
        next(err);
    }
});


export {router as signInRouter};