import {Listener,OrderCreatedEvent,Subjects} from '@rbtickets/sharedlib';
import {queueGroupName} from "./queue-group-name";
import {Message} from 'node-nats-streaming';
import {TicketRepo} from '../../db/repo/ticketRepo';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    queueGroupName:string = queueGroupName;
    subject:OrderCreatedEvent['subject'] = Subjects.OrderCreated;
    
    async onMessage(data:OrderCreatedEvent['data'],msg:Message){
        const {id,ticket} = data;
        const existing_ticket = await TicketRepo.getTicketById(ticket.id);
        if(!existing_ticket) throw new Error('ticket doesnot exist');
        // setting the order id property to mark as the ticket as being reserved
        const re = await TicketRepo.reserveTicketById(ticket.id,{orderId:id});
        // since the ticket has been updated it also needs to be synced with ticket in the orders service
        // so publish/fire a ticket updated event
        const formattedResult = TicketRepo.mapDocToObj(re);
        await new TicketUpdatedPublisher(this.client).publish(formattedResult);
        msg.ack();
    }
}