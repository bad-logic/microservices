import {Publisher, PaymentCreatedEvent,Subjects} from "@rbtickets/sharedlib";



export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject:PaymentCreatedEvent['subject'] = Subjects.PaymentCreated
}