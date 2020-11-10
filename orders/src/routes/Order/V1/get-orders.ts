import { allowAuthOnly } from '@rbtickets/sharedlib';
import express,{Request,Response,NextFunction} from 'express';
import {OrderRepo} from '../../../db/repo/orderRepo';

const router = express.Router();

// GET /api/order/v1/get-orders
router.get('/',allowAuthOnly,async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const orders = await OrderRepo.getOrdersByUserId(req.currentUser!.id);
        res.status(200).send({msg:'order fetched successfully',orders:orders});
    }catch(err){
        console.log(err);
        next(err);
    }
});



export {router as getOrdersRouter};