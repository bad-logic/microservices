import {TicketCreatedEvent} from '@rbtickets/sharedlib';
import {TicketCreatedListener} from '../ticket-created-listener';
import {natsWrapper} from '../../../nats-wrapper';
import {ObjectID} from 'mongodb';
import {Message} from 'node-nats-streaming';
import {TicketRepo} from '../../../db/repo/ticketRepo';

const setup = ()=>{
    // create an instance of a listener
    // @ts-ignore
    const listener = new TicketCreatedListener(natsWrapper.client);
    // create a fake data event
    const data:TicketCreatedEvent["data"] = {
        id: new ObjectID().toHexString(),
        price: 23,
        title:'ticket to paradise',
        userId: new ObjectID().toHexString(),
        version: 1
    }
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    
    return {listener,data,msg};
}

describe('testing the ticket created listener',()=>{

    it('creates and saves a ticket',async()=>{
        
        const {listener,data,msg} = setup();
        // call the onMesage function with the data object and message object
        await listener.onMessage(data,msg);
        // write assertions to make sure that a ticket was created
        const ticket = await TicketRepo.getTicketById(data.id);
        expect(ticket).toBeDefined();
        expect(ticket.title).toEqual(data.title);
        expect(ticket.price).toEqual(data.price);
        
    });

    it('acks the message',async()=>{

        const {listener,data,msg} = setup();
        // call the onMesage function with the data object and message object
        await listener.onMessage(data,msg);
        // write assertions to make sure that the ack function is called
        expect(msg.ack).toHaveBeenCalled();
    })
})