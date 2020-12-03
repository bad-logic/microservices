import {ExpirationCompleteEvent, OrderStatus} from '@rbtickets/sharedlib';
import {ObjectID} from 'mongodb';
import {ExpirationCompleteListener} from './../expiration-complete-listener';
import {natsWrapper} from './../../../nats-wrapper';
import {TicketRepo} from '../../../db/repo/ticketRepo';
import {OrderRepo} from '../../../db/repo/orderRepo';

const setup = async ()=>{
    // create an instance of a listener
    // @ts-ignore
    const listener = new ExpirationCompleteListener(natsWrapper.client);
    const tick = {
        id: new ObjectID().toHexString(),
        price: 23,
        title:'ticket to paradise',
        userId: new ObjectID().toHexString(),
        version: 0
    }
    // save that ticket
    await TicketRepo.createTicket(tick.id,tick.title,tick.price,tick.userId);
    const order = await OrderRepo.createOrder(OrderStatus.Created,new Date(),tick.id,new ObjectID().toHexString());
    // create a fake data event
    const data:ExpirationCompleteEvent["data"] = {
        orderId: order._id
    }
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    
    return {listener,data,msg};
}


describe('testing the expiration complete listener',()=>{
    it('should change the order status to cancelled',async()=>{
        const {listener,data,msg} = await setup();
        await listener.onMessage(data,msg);
        const order = await OrderRepo.getOrderById(data.orderId);
        expect(order.status).toEqual(OrderStatus.Cancelled);
    });
    it('should ack the msg',async()=>{
        const {listener,data,msg} = await setup();
        await listener.onMessage(data,msg);
        expect(msg.ack).toHaveBeenCalled();
        expect(msg.ack).toHaveBeenCalledTimes(1);
    });
    it('should fire order cancelled events',async()=>{
        const {listener,data,msg} = await setup();
        await listener.onMessage(data,msg);
        expect(natsWrapper.client.publish).toHaveBeenCalled();
        expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
        expect(JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]).id).toEqual(data.orderId.toString());
        expect((natsWrapper.client.publish as jest.Mock).mock.calls[0][0]).toEqual('order:cancelled');
    });
});