import express,{Request,Response,NextFunction} from 'express';
import {setCurrentUser} from '@rbtickets/sharedlib';
const router = express.Router();


// GET /api/auth/v1/current-user
router.get('/',setCurrentUser(process.env.JWT_SECRET_KEY!),(req:Request,res:Response,next:NextFunction)=>{
    try{
        // NOTE: you need to get the user info from the database just to check if user still exists
        // in our database in case of valid jwt
        res.status(200).send({
            message:'current user fetched successfully',
            user:req.currentUser||null
        });
    }catch(err){
        next(err);
    }
});


export {router as currentUserRouter};