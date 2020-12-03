import { Listener, OrderCancelledEvent, Subjects } from "@rbtickets/sharedlib";
import { queueGroupName } from "./queue-group-name";
import { Message } from 'node-nats-streaming';
import { OrderRepo } from "../../db/repo/orderRepo";


export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    queueGroupName: string = queueGroupName;
    subject:OrderCancelledEvent['subject'] = Subjects.OrderCancelled;

    async onMessage(data:OrderCancelledEvent['data'],msg:Message){
        const exists = await OrderRepo.getOrderById(data.id);
        if(exists){
            if(data.version - 1 > exists.version) return; // future event
            if(data.version - 1 === exists.version){
                await OrderRepo.cancelOrder(data.id);
            }
            msg.ack();
        }
    }
}