
import {Publisher,Subjects,TicketCreatedEvent} from '@rbtickets/sharedlib';


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: TicketCreatedEvent['subject'] = Subjects.TicketCreated;
}

