import {Listener,Subjects,TicketUpdatedEvent} from '@rbtickets/sharedlib';
import {Message} from 'node-nats-streaming';
import {TicketRepo} from '../../db/repo/ticketRepo';
import {queueGroupName} from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject:TicketUpdatedEvent['subject'] = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data:TicketUpdatedEvent['data'],msg:Message){
        const {id,price,title,version} = data;
        const formerTicket = await TicketRepo.getTicketById(id);
        // there may be cases in which update event of a ticket is fired by event bus
        // before the ticket created event if actions are executed within short duration
        // we also need to handle this instead of throwing errors
        if(!formerTicket) throw new Error('ticket not found'); // donot throw error
        
        // if the version-1 is greater than current ticket version then this is the event
        // to be processed in future but has happened to be emitted from the nats server
        // before its time. so just return do not acknowledge it because it needs to be
        // processed somtimes in the future, since unacknowledged events are sent again
        // after sometime in future by the nats server
        // this occurs if the events are out of order
        if(version-1 > formerTicket.version) return;
        // if version-1 is equal to the current ticket version then the event is valid
        // and should update the ticket
        if(version-1 === formerTicket.version){
            let unset = false;
            if(!data.orderId) unset = true; // indicates this is event fired after ticket has been cancelled to unreserve the ticket
            const tic = await TicketRepo.updateTicket(id,{price,title,orderId:data.orderId},unset);
        }
        // else if version-1 is less than the current ticket version then acknowledge it
        // because it is probably already processed event and has not been acknowledged due 
        // timeout or some type of issues  and we donot want this event to be sent to 
        // the event subscribers again and again
        // this event occurs if the events are already processed but not acknowledged
        msg.ack();
    }
}