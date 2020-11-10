import express,{Request,Response,NextFunction} from 'express';
import {NotFoundError,allowAuthOnly,AuthenticationError,validate, BadRequestError} from '@rbtickets/sharedlib';
import {TicketRepo} from '../../../db/repo/ticketRepo';
import {TicketUpdatedPublisher} from '../../../Events/publishers/ticket-updated-publisher';
import {natsWrapper} from '../../../nats-wrapper';
import {ObjectID} from 'mongodb';
import Joi from 'joi';

const router = express.Router();

const updateTicketSchema = Joi.object().keys({
    id: Joi.string().custom((value,helpers)=>{
        const isValid = ObjectID.isValid(value);
        if(!isValid) return helpers.error("any.invalid");
        return value;
    },'validating if the id is of type objectID').required(),
    userId:Joi.string().custom((value,helpers)=>{
        const isValid = ObjectID.isValid(value);
        if(!isValid) return helpers.error("any.invalid");
        return value;
    },'validating if the id is of type objectID').required(),
    version:Joi.number().required().min(0),
    title: Joi.string().min(3).trim(),
    price: Joi.number().min(1),
    orderId: Joi.string()
});

// PUT /api/ticket/v1/edit-ticket/
router.put('/',allowAuthOnly,validate(updateTicketSchema),async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {id,userId,version,...rest} = req.validData;
        if(req.currentUser!.id !== userId) throw new AuthenticationError('You cannot edit this ticket');
        const exist = await TicketRepo.getTicketById(id);
        if(!exist) throw new NotFoundError('No such ticket exists to update');
        if(exist.orderId) throw new BadRequestError('Cannot edit a reserved ticket');
        const tick = await TicketRepo.updateTicket(id,userId,version,rest);
        const formattedResult = TicketRepo.mapDocToObj(tick);
        new TicketUpdatedPublisher(natsWrapper.client).publish(formattedResult)
        res.status(201).send({msg:'ticket updated successfully',ticket:formattedResult});
    }catch(err){
        next(err);
    }
});



export {router as editTicketRouter};