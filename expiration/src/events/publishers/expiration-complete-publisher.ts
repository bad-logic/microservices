import { Publisher, ExpirationCompleteEvent, Subjects } from "@rbtickets/sharedlib";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject:ExpirationCompleteEvent['subject'] = Subjects.ExpirationComplete;
}