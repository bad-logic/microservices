import {natsWrapper} from '../../../../nats-wrapper';
import {ObjectID} from 'mongodb';
import {db} from '../../../../test/mongo';
import { OrderStatus } from '@rbtickets/sharedlib';

// since we defined to user mock file in setup.ts we will be getting natsWrapper from mock folder
describe('testing the POST /api/v1/order/new-order route',()=>{
    
    it('has a route handler listening to the route',async()=>{
        const val = await global.server()
        .post('/api/order/v1/new-order')
        .send({});
        expect(val.status).not.toEqual(404);
    });
    
    it('route can be accessed only by signed in user',async()=>{
        const val = await global.server()
        .post('/api/order/v1/new-order')
        .send({});
        expect(val.status).toEqual(401);
    });
    
    it('does not return 401 if user is signed in',async()=>{
        const cookie = global.mockCookie();
        const val = await global.server()
        .post('/api/order/v1/new-order')
        .set('Cookie',cookie)
        .send({});
        expect(val.status).not.toEqual(401);
    });
    
    it('returns error if the ticket is invalid',async()=>{
        const res = await global.server()
        .post('/api/order/v1/new-order')
        .set('Cookie',global.mockCookie())
        .send({ticketId: 'dsf45sdfsdf545'})
        .expect(400);
        expect(res.body.errors[0].field).toBe('ticketId');
    });

    it('returns error if the ticket doesnot exists',async()=>{
        const res = await global.server()
        .post('/api/order/v1/new-order')
        .set('Cookie',global.mockCookie())
        .send({ticketId: new ObjectID()})
        .expect(404);
    });

    it('returns error if the ticket is already reserved',async()=>{
            // create ticket
            const res = await db.collection('ticket').insertOne({title:'hello',price:22});
            const tid =  res.ops[0]._id;
            // reserve created ticket
            const res1 = await db.collection('order').insertOne({
                status:OrderStatus.Created,
                expiresAt:new Date(),
                userId:'dsfsdhfkdh453853',
                ticket:tid
            });
            // try to reserve same ticket
            const res2 = await global.server()
            .post('/api/order/v1/new-order')
            .set('Cookie',global.mockCookie())
            .send({ticketId:tid})
            .expect(400);
            expect(res2.body.errors[0].message).toBe('Ticket is Already Reserved');
    });

    it('reserves the ticket',async()=>{
          // create ticket
          const res = await db.collection('ticket').insertOne({title:'hello',price:22});
          const tid =  res.ops[0]._id;
          // reserve created ticket
          const res1 = await global.server()
            .post('/api/order/v1/new-order')
            .set('Cookie',global.mockCookie())
            .send({ticketId:tid}).expect(201);
          expect(res1.body.msg).toBe('new order created');
          expect(res1.body.order).toBeDefined();
          expect(res1.body.order.status).toBe(OrderStatus.Created);
    });

    it('publishes an order:created event',async ()=>{
        // create ticket
        const res = await db.collection('ticket').insertOne({title:'hello',price:22});
        const tid =  res.ops[0]._id;
        // reserve created ticket
        const res1 = await global.server()
          .post('/api/order/v1/new-order')
          .set('Cookie',global.mockCookie())
          .send({ticketId:tid}).expect(201);
        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
});
