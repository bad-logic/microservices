import {Listener,Subjects,TicketCreatedEvent} from '@rbtickets/sharedlib';
import {Message} from 'node-nats-streaming';
import {TicketRepo} from '../../db/repo/ticketRepo';
import {queueGroupName} from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject:TicketCreatedEvent['subject'] = Subjects.TicketCreated;
    queueGroupName= queueGroupName;
    async onMessage(data:TicketCreatedEvent['data'],msg:Message){
        const {id,price,title,userId} = data;
        // in cases where the ticket is already created in the db but
        // due to ackWait is set to 5 seconds. if db operation takes more than 5 seconds
        // then this event of msg received is not acknowledged even though we have already
        // processed the event. so nats server will send this event again since we have not
        // had the time to acknowledge it due to time limit and when we try to
        // process this event again we may get duplicate _id error
        // so to avoid this, acknowledge this recurring events immmediately by checking if
        // ticket of that id already exists in db. if exists  then we have already processed the
        // ticket created event for that ticket so we need to acknowledge it so that
        // nats server won't emit that event again
        const exists = await TicketRepo.getTicketById(id);
        if(!exists){
            await TicketRepo.createTicket(id,title,price,userId);
        }
        msg.ack();
    }
}