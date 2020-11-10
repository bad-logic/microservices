import express,{Request,Response,NextFunction} from 'express';
import {NotFoundError,allowAuthOnly, AuthenticationError} from '@rbtickets/sharedlib';
import {OrderRepo} from '../../../db/repo/orderRepo';
import {natsWrapper} from '../../../nats-wrapper';
import {OrderCancelledPublisher} from '../../../Events/Publishers/order-cancelled-publisher';

import { ObjectID } from 'mongodb';

const router = express.Router();

// PUT /api/order/v1/cancel-order/:orderId
router.put('/:orderId',allowAuthOnly,async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const orderId = req.params.orderId;
        const isValid = ObjectID.isValid(orderId);
        if(!isValid) throw new NotFoundError('order with that id not found');
        const ord = await OrderRepo.cancelOrder(orderId,req.currentUser!.id);
        if(!ord) throw new AuthenticationError('You cannot cancel this order');
        // emit order cancelled event to nats server
        new OrderCancelledPublisher(natsWrapper.client).publish({
            id:ord.id,
            version:ord.version,
            ticket:{
                id:ord.ticket.id
            }
        });
        res.status(201).send({msg:'order cancelled successfully',order:ord});
    }catch(err){
        next(err);
    }
});



export {router as cancelOrderRouter};