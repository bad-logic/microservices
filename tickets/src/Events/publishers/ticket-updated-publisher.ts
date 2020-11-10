import {Publisher,TicketUpdatedEvent,Subjects} from '@rbtickets/sharedlib';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject:TicketUpdatedEvent['subject'] = Subjects.TicketUpdated;
}