import express,{Request,Response,NextFunction} from 'express';
import {allowAuthOnly,validate,NotFoundError, BadRequestError, OrderStatus} from '@rbtickets/sharedlib';
import {OrderRepo} from '../../../db/repo/orderRepo';
import {TicketRepo} from '../../../db/repo/ticketRepo';
import {natsWrapper} from '../../../nats-wrapper';
import {OrderCreatedPublisher} from '../../../Events/Publishers/order-created-publisher';

import Joi from 'joi';
import { ObjectID } from 'mongodb';

const ORDER_EXPIRE_WINDOW_SECONDS = 15*60; // 15 minutes

const router = express.Router();

const OrderValidationSchema = Joi.object().keys({
    ticketId: Joi.string().custom((value,helpers)=>{
        const isValid = ObjectID.isValid(value);
        if(!isValid) return helpers.error("any.invalid");
        return value;
    },'validating if the id is of type objectID').required()
});

// POST /api/ticket/v1/new-order
router.post('/',allowAuthOnly,validate(OrderValidationSchema),async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {ticketId} = req.validData;
        // find the ticket inside the database
        const ticket = await TicketRepo.getTicketById(ticketId);
        if(!ticket) throw new NotFoundError('invalid ticket id');
        // make sure that the ticket is not already reserved or ordered by someone
        const reservedOrder = await OrderRepo.ticketIsReserved(ticket._id);
        if(reservedOrder){
            // cannot create order because it is reserved
            throw new BadRequestError('Ticket is Already Reserved');
        }
        // create order for that ticket
        // calculate the expiry time
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds()+ ORDER_EXPIRE_WINDOW_SECONDS); // set to expire after 15 minutes in future
        const order = await OrderRepo.createOrder(OrderStatus.Created,expiration,ticket._id,req.currentUser!.id);
        const formattedResult = OrderRepo.mapDocToObj(order);
        formattedResult.ticket = TicketRepo.mapDocToObj(ticket);
        // emit order created event to nats server
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id:formattedResult.id,
            status: formattedResult.status,
            expiresAt: formattedResult.expiresAt.toISOString(),
            userId: formattedResult.userId,
            version:formattedResult.version,
            ticket:{
                id:formattedResult.ticket._id,
                price:formattedResult.ticket.price
            }
        });
        res.status(201).send({'msg':'new order created',order:formattedResult});
    }catch(err){
        next(err);
    }
});



export {router as newOrderRouter};