import {Listener,OrderCancelledEvent,Subjects} from '@rbtickets/sharedlib';
import {queueGroupName} from "./queue-group-name";
import {Message} from 'node-nats-streaming';
import {TicketRepo} from '../../db/repo/ticketRepo';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';


export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: OrderCancelledEvent['subject'] = Subjects.OrderCancelled;
    queueGroupName: string = queueGroupName;

    async onMessage(data:OrderCancelledEvent['data'],msg:Message){
        const {ticket} = data;
        const existing_ticket = await TicketRepo.getTicketById(ticket.id);
        if(!existing_ticket) throw new Error('ticket doesnot exist');
        // unsetting the order id property to mark as the ticket as being unreserved/cancelled
        const re = await TicketRepo.unreserveTicketById(ticket.id);
        // since the ticket has been updated it also needs to be synced with ticket in the orders service
        // so publish/fire a ticket updated event
        const formattedResult = TicketRepo.mapDocToObj(re);
        await new TicketUpdatedPublisher(this.client).publish(formattedResult);
        msg.ack();
    }
}