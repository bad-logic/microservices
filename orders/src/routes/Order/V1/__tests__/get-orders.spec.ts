import { ObjectID } from 'mongodb';
import {db} from '../../../../test/mongo';

describe('testing GET /api/order/v1/get-orders',()=>{
    const createTicketAndMakeOrder = async(userId)=>{
        const res = await db.collection('ticket').insertOne({title:'hello',price:22});
        const tid =  res.ops[0]._id;
        // reserve created ticket
        const {body} =await global.server()
          .post('/api/order/v1/new-order')
          .set('Cookie',global.mockCookie(userId))
          .send({ticketId:tid});

          return {tId:tid,oId:body.order.id};
    }
    it('should return a list of current users orders',async()=>{
        const user1 = new ObjectID();
        const user2 = new ObjectID();

        const Ids = await Promise.all([
            createTicketAndMakeOrder(user1),
            createTicketAndMakeOrder(user2),
            createTicketAndMakeOrder(user2)
        ]);

        const res = await global.server()
        .get('/api/order/v1/get-orders')
        .set('Cookie',global.mockCookie(user1))
        .send();

        expect(res.status).toBe(200);
        expect(res.body.orders instanceof Array).toBe(true);
        expect(res.body.orders.length).toBe(1);

        // checking the user id to verify if it was ordered by the same user
        expect(res.body.orders[0].userId).toEqual(user1.toString());

        // checking if the order and ticket ids returned are same as created
        expect(res.body.orders[0].id).toEqual(Ids[0].oId);
        expect(res.body.orders[0].ticket.id).toEqual(Ids[0].tId.toString());
        
        const res1 = await global.server()
        .get('/api/order/v1/get-orders')
        .set('Cookie',global.mockCookie(user2))
        .send();

        expect(res1.status).toBe(200);
        expect(res1.body.orders instanceof Array).toBe(true);
        expect(res1.body.orders.length).toBe(2);

        // checking the user id to verify if it was ordered by the same user
        expect(res1.body.orders[0].userId).toEqual(user2.toString());
        expect(res1.body.orders[1].userId).toEqual(user2.toString());

        // checking if the order and ticket ids returned are same as created
        expect(res1.body.orders[0].id).toEqual(Ids[1].oId);
        expect(res1.body.orders[1].id).toEqual(Ids[2].oId);
        expect(res1.body.orders[0].ticket.id).toEqual(Ids[1].tId.toString());
        expect(res1.body.orders[1].ticket.id).toEqual(Ids[2].tId.toString());


    });
});