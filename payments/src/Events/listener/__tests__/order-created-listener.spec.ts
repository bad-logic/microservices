
import { OrderCreatedEvent, OrderStatus } from '@rbtickets/sharedlib';
import { ObjectID } from 'mongodb';
import {OrderRepo} from '../../../db/repo/orderRepo';
import {natsWrapper} from '../../../nats-wrapper';
import {OrderCreatedListener} from '../order-created-listener';
import {Message} from 'node-nats-streaming';

const setup = async()=>{
    // create an instance of ordercreated listener
    const listener = new OrderCreatedListener(natsWrapper.client);
    // create an event data
    const data:OrderCreatedEvent['data'] = {
        id: new ObjectID().toHexString(),
        status: OrderStatus.Created,
        userId: new ObjectID().toHexString(),
        expiresAt: 'dsafsadf',
        version:0,
        ticket:{
            id: new ObjectID().toHexString(),
            price: 25
        }
    }   
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener,data,msg};
}

describe('testing the order created events',()=>{


    it('should create an order in the database',async()=>{
        const {listener,data,msg} = await setup();
        await listener.onMessage(data,msg);
        const ord = await OrderRepo.getOrderById(data.id);
        expect(ord.status).toEqual(data.status);
        expect(ord.price).toEqual(data.ticket.price);
        expect(ord.userId).toEqual(data.userId);
        expect(ord.ticket.toString()).toEqual(data.ticket.id.toString());
    });

    it('should ack the msg',async()=>{
        const {listener,data,msg} = await setup();
        await listener.onMessage(data,msg);
        expect(msg.ack).toHaveBeenCalled();
        expect(msg.ack).toHaveBeenCalledTimes(1);
    });

    
});