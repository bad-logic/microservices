import { Listener, OrderCreatedEvent, Subjects } from "@rbtickets/sharedlib";
import { queueGroupName } from "./queue-group-name";
import { Message } from 'node-nats-streaming';
import {OrderRepo} from './../../db/repo/orderRepo';

 
export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    queueGroupName: string = queueGroupName;
    subject:OrderCreatedEvent['subject'] = Subjects.OrderCreated;

    async onMessage(data:OrderCreatedEvent['data'],msg:Message){
        const exists = await OrderRepo.getOrderById(data.id);
        if(!exists){
            const {id,status,userId,ticket} = data;
            await OrderRepo.createOrder(id,status,ticket.id,ticket.price,userId);
        }
        msg.ack();
    }
}