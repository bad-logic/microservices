import express,{Request,Response,NextFunction} from 'express';
import {NotFoundError,allowAuthOnly, AuthenticationError} from '@rbtickets/sharedlib';
import {OrderRepo} from '../../../db/repo/orderRepo';

const router = express.Router();

// GET /api/order/v1/get-order/:orderId
router.get('/:orderId',allowAuthOnly,async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const order = await OrderRepo.getOrderById(req.params.orderId);
        if(!order) throw new NotFoundError('order Not found');
        if(order.userId!==req.currentUser!.id) throw new AuthenticationError('cannot access order');
        res.status(200).send({msg:'order fetched successfully',order:order});
    }catch(err){
        next(err);
    }
});



export {router as getOrderRouter};