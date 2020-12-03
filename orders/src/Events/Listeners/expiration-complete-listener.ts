import { ExpirationCompleteEvent, Listener, Subjects,OrderStatus } from "@rbtickets/sharedlib";
import { queueGroupName } from "./queue-group-name";
import { Message } from 'node-nats-streaming';
import {OrderCancelledPublisher} from '../Publishers/order-cancelled-publisher';
import {OrderRepo} from '../../db/repo/orderRepo';
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{

    subject: ExpirationCompleteEvent['subject'] = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data:ExpirationCompleteEvent['data'],msg:Message){
        const orderExists = await OrderRepo.getOrderById(data.orderId);
        if(orderExists){
            if(orderExists.status===OrderStatus.Created){
                const ord = await OrderRepo.cancelOrder(data.orderId);
                // emit order cancelled event to nats server
                new OrderCancelledPublisher(natsWrapper.client).publish({
                    id:ord.id,
                    version:ord.version,
                    ticket:{
                        id:ord.ticket.id
                    }
                });
            }
        }
        msg.ack();
    }
}