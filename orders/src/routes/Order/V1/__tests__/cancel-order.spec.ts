import {natsWrapper} from '../../../../nats-wrapper';
import {db} from '../../../../test/mongo';
import {OrderStatus} from '@rbtickets/sharedlib';
import { ObjectID } from 'mongodb';

describe('testing PUT /api/v1/order/cancel-order',()=>{
    const createTicketAndMakeOrder = async(userId)=>{
        const res = await db.collection('ticket').insertOne({title:'hello',price:22});
        const tid =  res.ops[0]._id;
        // reserve created ticket
        const {body} = await global.server()
          .post('/api/order/v1/new-order')
          .set('Cookie',global.mockCookie(userId))
          .send({ticketId:tid});

          return {tId:tid,oId:body.order.id};
    }

    it('should return 401 if user not authenticated',async()=>{

        const resp = await global.server()
        .put(`/api/order/v1/cancel-order/somerandomid`)
        .send().expect(401);
        expect(resp.body.errors[0].message).toBe("Not Authorised");

    });

    it('should return 404 error if orderid is invalid',async()=>{
        
        const resp = await global.server()
        .put(`/api/order/v1/cancel-order/someran45domid`)
        .set('Cookie',global.mockCookie(new ObjectID()))
        .send().expect(404);
        expect(resp.body.errors[0].message).toBe("order with that id not found");

    });

    it('should return 401 error if user tries to cancel order not owned by him',async()=>{

        const user1 = new ObjectID();
        const ids = await createTicketAndMakeOrder(user1);

        const user2 = new ObjectID();
        const resp = await global.server()
        .put(`/api/order/v1/cancel-order/${ids.oId}`)
        .set('Cookie',global.mockCookie(user2))
        .send().expect(401);
        expect(resp.body.errors[0].message).toBe("You cannot cancel this order");
    });

    it('should mark the order as cancelled if valid user cancels their order',async()=>{

        const user1 = new ObjectID();
        const ids = await createTicketAndMakeOrder(user1);

        const resp = await global.server()
        .put(`/api/order/v1/cancel-order/${ids.oId}`)
        .set('Cookie',global.mockCookie(user1))
        .send().expect(201);
        expect(resp.body.order.status).toBe(OrderStatus.Cancelled);
        expect(resp.body.order.userId).toBe(user1.toString());
    });

    
    it('publishes an order:cancelled event',async ()=>{

        const user1 = new ObjectID();
        const ids = await createTicketAndMakeOrder(user1);

        const resp = await global.server()
        .put(`/api/order/v1/cancel-order/${ids.oId}`)
        .set('Cookie',global.mockCookie(user1))
        .send().expect(201);
        expect(resp.body.order.status).toBe(OrderStatus.Cancelled);
        expect(resp.body.order.userId).toBe(user1.toString());

        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });

});
