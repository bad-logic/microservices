import express,{Request,Response,NextFunction} from 'express';
import {allowAuthOnly,validate} from '@rbtickets/sharedlib';
import {TicketRepo} from '../../../db/repo/ticketRepo';
import {TicketCreatedPublisher} from '../../../Events/publishers/ticket-created-publisher';
import {natsWrapper} from '../../../nats-wrapper';

import Joi from 'joi';

const router = express.Router();

const TicketValidationSchema = Joi.object().keys({
    title: Joi.string().required().min(3).trim(),
    price: Joi.number().positive().min(1).required()
});

// POST /api/ticket/v1/new-ticket
router.post('/',allowAuthOnly,validate(TicketValidationSchema),async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {title,price} = req.validData;
        const result = await TicketRepo.createTicket(title,price,req.currentUser!.id);
        const formattedResult = TicketRepo.mapDocToObj(result);
        new TicketCreatedPublisher(natsWrapper.client).publish(formattedResult);
        res.status(201).send({'msg':'new ticket created',ticket:formattedResult});
    }catch(err){
        next(err);
    }
});



export {router as newTicketRouter};