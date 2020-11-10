import {natsWrapper} from '../../../nats-wrapper';
import {ObjectID} from 'mongodb';
import {Message} from 'node-nats-streaming';
import {TicketRepo} from '../../../db/repo/ticketRepo';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import {TicketUpdatedEvent} from '@rbtickets/sharedlib';

const setup = async ()=>{
    const data = {
        id: new ObjectID().toHexString(),
        price: 23,
        title:'ticket to paradise',
        userId: new ObjectID().toHexString(),
        version: 0
    }
    // save that ticket
    await TicketRepo.createTicket(data.id,data.title,data.price,data.userId);
    // create an instance of a listener
    // @ts-ignore
    const update_listener = new TicketUpdatedListener(natsWrapper.client);
    // create a fake data event
    const update_data:TicketUpdatedEvent["data"] = {
        id: data.id,
        price: 25,
        title:'ticket to paradise',
        userId: data.userId,
        version: 1
    }
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {update_listener,update_data,msg};
}

describe('testing the ticket updated listener',()=>{

    it('finds a ticket with specific version and updates a ticket',async()=>{
        
        const {update_listener,update_data,msg} = await setup();
        // call the onMesage function with the data object and message object
        await update_listener.onMessage(update_data,msg);
        // write assertions to make sure that a ticket was updated
        const ticket = await TicketRepo.getTicketById(update_data.id);
        expect(ticket).toBeDefined();
        expect(ticket.version).toEqual(1);
        expect(ticket.title).toEqual(update_data.title);
        expect(ticket.price).toEqual(update_data.price);
        
    });

    it('acks the message',async()=>{

        const {update_listener,update_data,msg} = await setup();
        // call the onMesage function with the data object and message object
        await update_listener.onMessage(update_data,msg);
        // write assertions to make sure that the ack function is called
        expect(msg.ack).toHaveBeenCalled();
        expect(msg.ack).toBeCalledTimes(1);
    });

    it('does not call ack function if the event has the version number that should have been emitted in the future',async()=>{
        const {update_listener,update_data,msg} = await setup();
        // in setup function we create a ticket entry in the database
        // and the version number of that ticket will be 0
        // so if we send an event with the ticket data with version number greater than 1
        // than the ack function should not be called
        // current version in the database is zero 0 and it is expecting the event with version 1 
        update_data.version = 4; // setting the version number greater than 1
        // call the onMessage function with the data  object and message object
        await update_listener.onMessage(update_data,msg);
        // write the assertions to make sure that the ack function is not called
        expect(msg.ack).not.toHaveBeenCalled();
    })

    it('calls the ack function if the event has the ticket with version number less than or equal to the version stored in the database',async()=>{
        // this case usually occurs if the event has already been handled but the
        // server has not been able to acknowledge the event due to timeout or something
        // since the database version is greater than or equal to the version of this event data
        // this event has already been handled so we just need to acknowledge the event but don't process it
        // so that it is not fired again by the nats server in the future
        const {update_listener,update_data,msg} = await setup();
        // current version is zero 0 in the database and it is expecting the event with version 1
        update_data.version = 0;// version less than or equal to current version in the database
        // call the onMessage function with the data object and message object
        await update_listener.onMessage(update_data,msg);
        // write the assertions to make sure that the event has been acknowledged
        expect(msg.ack).toHaveBeenCalled();
        expect(msg.ack).toHaveBeenCalledTimes(1);   
    })
})