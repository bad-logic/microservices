
import {Listener,OrderCreatedEvent,Subjects} from '@rbtickets/sharedlib';
import {queueGroupName} from './queue-group-name';
import {Message} from 'node-nats-streaming';
import  {expirationQueue} from './../../queues/expiration-queue';

export class orderCreatedListener extends Listener<OrderCreatedEvent>{

    queueGroupName = queueGroupName;

    subject: OrderCreatedEvent['subject'] = Subjects.OrderCreated;
    
    async onMessage(data:OrderCreatedEvent['data'],msg:Message){
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

        await expirationQueue.add(
            {orderId:data.id}
            ,{delay: delay } // delay in ms
        );
        msg.ack();
    }

}