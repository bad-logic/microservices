import express,{NextFunction, Request,Response} from 'express';
import {BadRequestError,NotFoundError,allowAuthOnly,validate, AuthenticationError, OrderStatus} from '@rbtickets/sharedlib';
import {OrderRepo} from '../../../db/repo/orderRepo';
import {PaymentRepo} from '../../../db/repo/paymentRepo';
import {ObjectID} from 'mongodb';
import Joi from 'joi';
import {stripe} from '../../../stripe';
import {PaymentCreatedPublisher} from '../../../Events/publisher/payment-created-publisher';
import {natsWrapper} from '../../../nats-wrapper';

const router = express.Router();

const newPaymentValidationSchema = Joi.object().keys({
    orderId:Joi.string().custom((value,helpers)=>{
        const isValid = ObjectID.isValid(value);
        if(!isValid) return helpers.error("any.invalid");
        return value;
    },'validating if the id is of type objectID').required(),
    token: Joi.string().required()
});

// POST api/payments/v1/new-payment
router.post('/',allowAuthOnly,validate(newPaymentValidationSchema),async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {token,orderId} = req.validData;
        const order = await OrderRepo.getOrderById(orderId);
        if(!order){
            throw new NotFoundError();
        }
        if(order.userId !== req.currentUser!.id){
            throw new AuthenticationError();
        }
        if(order.status === OrderStatus.Cancelled){
            throw new BadRequestError('order has expired');
        }
        // we have not fired order updated event so order.status is never complete
        // eventhough order has already been paid so there is flaw yo can pay
        // multiple times for same product
        // TODO after payment is created fire order update event with status set to complete
        // and catch that event and update the order collection
        if(order.status === OrderStatus.Complete){
            throw new BadRequestError('Payment already completed');
        }
        const charge = await stripe.charges.create({
            currency:'usd',
            amount:Math.round(order.price*100), // converting to cents for usd
            source: token,
            description:`purchasing ticket ${order.ticket}`
        });
        const payment = await PaymentRepo.createPayment(orderId,charge.id); 
        const val = PaymentRepo.mapDocToObj(payment);
        // emit order completed event
        new PaymentCreatedPublisher(natsWrapper.client).publish(val);
        res.status(201).send({success:true,id:payment._id});
    }catch(err){
        console.log('ERROR',err);
        next(err);
    }
});

export {router as newPaymentRouter};