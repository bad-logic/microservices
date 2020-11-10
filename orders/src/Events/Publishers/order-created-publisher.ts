import {OrderCreatedEvent,Publisher, Subjects} from '@rbtickets/sharedlib';


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: OrderCreatedEvent['subject'] = Subjects.OrderCreated;
}