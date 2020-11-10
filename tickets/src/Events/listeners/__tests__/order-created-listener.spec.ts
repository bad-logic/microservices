import {TicketRepo} from '../../../db/repo/ticketRepo';
import {ObjectID} from 'mongodb';
import {natsWrapper} from '../../../nats-wrapper';
import {OrderCreatedListener} from '../order-created-listener';
import {OrderCreatedEvent, OrderStatus} from '@rbtickets/sharedlib';
import {Message} from 'node-nats-streaming';


async function setup(){
    // create a ticket that you want to reserve
    const ticket = await TicketRepo.createTicket('ticket to paradise',500,new ObjectID().toHexString());
    // initialize the listener
    const listener = new OrderCreatedListener(natsWrapper.client);
    // create the fake order created event 
    const data:OrderCreatedEvent['data'] = {
        id:new ObjectID().toHexString(),
        status:OrderStatus.Created,
        userId:new ObjectID().toHexString(), // user who purchased the ticket or made order
        version:0,
        ticket:{
            id:(ticket._id).toHexString(),
            price:ticket.price
        },
        expiresAt: 'fdlskjfldj'
    }
    // create a fake message object
    // @ts-ignore
    const msg:Message = {
        ack:jest.fn()
    };
    return {data,listener,msg};
}

describe('testing the order created event',()=>{

    it('should mark the ticket as reserved if the order has been created',async ()=>{
        const {data,listener,msg} = await setup();
        await listener.onMessage(data,msg);
        // write assertions to make sure that the ticket is reserved 
        const res_ticket = await TicketRepo.getTicketById(data.ticket.id);
        expect(res_ticket).toBeDefined();
        expect(res_ticket.orderId).toBeDefined();
        expect(res_ticket.orderId).toEqual(data.id);
    });

    it('acks the message',async ()=>{
        const {data,listener,msg} = await setup();
        await listener.onMessage(data,msg);
        // write assertions to make sure that the ack has been called
        expect(msg.ack).toHaveBeenCalled();
        expect(msg.ack).toHaveBeenCalledTimes(1);
    });

    it('publishes a ticket updated event',async ()=>{
        const {data,listener,msg} = await setup();
        await listener.onMessage(data,msg);
        expect(natsWrapper.client.publish).toHaveBeenCalled();
        // @ts-ignore
        const args = JSON.parse(natsWrapper.client.publish.mock.calls[0][1]);
        // console.log((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
        expect(args.id).toEqual(data.ticket.id);
        expect(args.orderId).toEqual(data.id);
    });
});
