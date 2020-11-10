import express from 'express';

const router = express.Router();


// DELETE /api/auth/v1/sign-out
router.delete('/',(req,res,next)=>{
    try{
        req.session = null; // cookie-session will send instruction to the browser to clear cookie
        res.status(200).send({});
    }catch(err){
        next(err);
    }
});


export {router as signOutRouter};