import {TicketRepo} from '../../../db/repo/ticketRepo';
import {ObjectID} from 'mongodb';
import {natsWrapper} from '../../../nats-wrapper';
import {Message} from 'node-nats-streaming';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { OrderCancelledEvent } from '@rbtickets/sharedlib';

async function setup(){
    // create a ticket that you want to reserve
    const ticket = await TicketRepo.createTicket('ticket to paradise',500,new ObjectID().toHexString());
    // reserve the ticket
    const ticket1 = await TicketRepo.reserveTicketById(ticket._id,{orderId:new ObjectID().toHexString()});
    // initialize the listener
    const listener = new OrderCancelledListener(natsWrapper.client);
    // create the fake order cancelled event 
    const data:OrderCancelledEvent['data'] = {
        id:new ObjectID().toHexString(),
        version:1,
        ticket:{
            id:(ticket._id).toHexString(),
        }
    }
    // create a fake message object
    // @ts-ignore
    const msg:Message = {
        ack:jest.fn()
    };
    return {data,listener,msg};
}

describe('testing the order created event',()=>{

    it('should mark the ticket as cancelled if the order has been created',async ()=>{
        const {data,listener,msg} = await setup();
        await listener.onMessage(data,msg);
        const tick = await TicketRepo.getTicketById(data.ticket.id);
        expect(tick).toBeDefined();
        expect(tick.orderId).toBeUndefined();
    });
    it('should call the ack method',async()=>{
        const {data,listener,msg} = await setup();
        await listener.onMessage(data,msg);
        expect(msg.ack).toHaveBeenCalled();
        expect(msg.ack).toHaveBeenCalledTimes(1);
    });
    it('should publish ticketupdated event',async()=>{
        const {data,listener,msg} = await setup();
        await listener.onMessage(data,msg);
        expect(natsWrapper.client.publish).toHaveBeenCalled();
        const args = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
        expect(args.id).toEqual(data.ticket.id);
    });
});