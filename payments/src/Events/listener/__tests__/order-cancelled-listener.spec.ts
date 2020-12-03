import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import {Message} from 'node-nats-streaming';
import { OrderRepo } from "../../../db/repo/orderRepo";
import { ObjectID } from "mongodb";
import { OrderCancelledEvent, OrderStatus } from "@rbtickets/sharedlib";


const setup = async()=>{
    // create an instance of ordercreated listener
    const listener = new OrderCancelledListener(natsWrapper.client);
    // create an order entry with created status in the database
    const order = await OrderRepo.createOrder(
        new ObjectID().toHexString(),
        OrderStatus.Created,
        new ObjectID().toHexString(),
        25,
        new ObjectID().toHexString()
    );
    // create an event data
    const data:OrderCancelledEvent['data'] = {
        id:order._id,
        version:order.version+1,
        ticket:{
            id:order.ticket
        }
    }   
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener,data,msg};
}

describe('testing order cancelled events',()=>{

    it('should set the order status to cancelled',async()=>{
        const {listener,data,msg} = await setup();
        await listener.onMessage(data,msg);
        const cancelledOrder = await OrderRepo.getOrderById(data.id);
        expect(cancelledOrder._id).toEqual(data.id);
        expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
    });
    it('should ack the events',async()=>{
        const {listener,data,msg} = await setup();
        await listener.onMessage(data,msg);
        expect(msg.ack).toHaveBeenCalled();
        expect(msg.ack).toHaveBeenCalledTimes(1);
    });
});