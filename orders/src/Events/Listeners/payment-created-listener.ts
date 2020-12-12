import { PaymentCreatedEvent, Listener, Subjects,OrderStatus } from "@rbtickets/sharedlib";
import { queueGroupName } from "./queue-group-name";
import { Message } from 'node-nats-streaming';
import {OrderRepo} from '../../db/repo/orderRepo';


export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{

    subject: PaymentCreatedEvent['subject'] = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data:PaymentCreatedEvent['data'],msg:Message){
        const orderExists = await OrderRepo.getOrderById(data.orderId);
        if(orderExists){
            if(orderExists.status===OrderStatus.Created){
                await OrderRepo.completeOrder(data.orderId);
            }
        }
        msg.ack();
    }
}