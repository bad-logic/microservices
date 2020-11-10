import {OrderCancelledEvent,Publisher, Subjects} from '@rbtickets/sharedlib';


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: OrderCancelledEvent['subject'] = Subjects.OrderCancelled;
}