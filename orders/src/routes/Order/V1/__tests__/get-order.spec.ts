import { ObjectID } from "mongodb";
import { db } from "../../../../test/mongo";

describe('testing GET api/order/v1/get-order/:orderId',()=>{

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

    it('return 404 if order not found',async ()=>{
        await global.server()
        .get('/api/order/v1/get-order/fakeid')
        .set('Cookie',global.mockCookie())
        .send()
        .expect(404);
    });

    it('return 401 not authorised error if the user does not own the order',async ()=>{

        const user1 = new ObjectID();
        const user2 = new ObjectID();

        const Ids = await createTicketAndMakeOrder(user1);

        const res = await global.server()
        .get(`/api/order/v1/get-order/${Ids.oId}`)
        .set('Cookie',global.mockCookie(user2))
        .send().expect(401);
        expect(res.body.errors[0].message).toBe('cannot access order');
    });


    it('returns the order if the user owns the order',async ()=>{
        const user1 = new ObjectID();
        const user2 = new ObjectID();

        const Ids = await Promise.all([
            createTicketAndMakeOrder(user1),
            createTicketAndMakeOrder(user2),
        ]);

        const res = await global.server()
        .get(`/api/order/v1/get-order/${Ids[0].oId}`)
        .set('Cookie',global.mockCookie(user1))
        .send().expect(200);
        expect(res.body.order).toBeDefined();
        expect(res.body.order.id).toBe(Ids[0].oId);
        expect(res.body.order.ticket.id).toBe(Ids[0].tId.toString());
        expect(res.body.order.userId).toBe(user1.toString());

        const res1 = await global.server()
        .get(`/api/order/v1/get-order/${Ids[1].oId}`)
        .set('Cookie',global.mockCookie(user2))
        .send().expect(200);
        expect(res1.body.order).toBeDefined();
        expect(res1.body.order.id).toBe(Ids[1].oId);
        expect(res1.body.order.ticket.id).toBe(Ids[1].tId.toString());
        expect(res1.body.order.userId).toBe(user2.toString());
    });
});