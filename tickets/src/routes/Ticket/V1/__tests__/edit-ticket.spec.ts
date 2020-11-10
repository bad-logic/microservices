import bodyParser from 'body-parser';
import { ObjectID } from 'mongodb';
import {natsWrapper} from '../../../../nats-wrapper';

describe('testing PUT /api/v1/ticket/edit-ticket',()=>{
    const createTicket = ()=>{
        const cookie = global.mockCookie();
        return global.server()
        .post('/api/ticket/v1/new-ticket')
        .set('Cookie',cookie)
        .send({
            title:'second ticket',
            price: 25
        });
    }

    it('should return 401 if user not authenticated',async()=>{
        const resp = await global.server().put('/api/ticket/v1/edit-ticket',()=>{}).send();
        expect(resp.status).toBe(401);
    });

    it('should return 400 status code if userId or ticket id not provided',async()=>{
        const res = await createTicket();
        const tick = res.body.ticket;
        const resp = await global.server().put('/api/ticket/v1/edit-ticket',()=>{})
        .send(
            {
                id:tick.id,
                price:55
            }
        ).set('Cookie',global.mockCookie());
        expect(resp.status).toBe(400);
        expect(resp.body.errors[0].field).toBe('userId');
        const resp1 = await global.server().put('/api/ticket/v1/edit-ticket',()=>{})
        .send(
            {
                userId:tick.id,
                price:55
            }
        ).set('Cookie',global.mockCookie());
        expect(resp1.status).toBe(400);
        expect(resp1.body.errors[0].field).toBe('id');
        const resp2 = await global.server().put('/api/ticket/v1/edit-ticket',()=>{})
        .send(
            {
                userId:'kdsjlfjldskjfkdjsf',
                id:'dhsfhdshfkhdf',
                price:55
            }
        ).set('Cookie',global.mockCookie());
        expect(resp2.status).toBe(400);
        expect(resp2.body.errors[0].field).toBe('id');
        expect(resp2.body.errors[1].field).toBe('userId');
    });
    it('should return 401 status code if you try to edit tickets you don\'t own',async()=>{
        // creating ticket using default user
        const ticket1 = await global.server().post('/api/ticket/v1/new-ticket')
        .set('Cookie',global.mockCookie())
        .send({
            title:'my first ticket',
            price: 25
        });
        const ticket1update = {
            ...ticket1.body.ticket,price:55
        }
        const updateRes = await global.server().put('/api/ticket/v1/edit-ticket')
        .set('Cookie',global.mockCookie('5f59eca8a5d1b4f04d5266e5')) // creating session for new user
        .send({...ticket1update}) // ticket of default user
        expect(updateRes.status).toBe(401);
        expect(updateRes.body.errors[0].message).toEqual('You cannot edit this ticket');
    });
    it('should return 404 error if ticket id does not exists',async()=>{
        const ticket2 = await global.server().post('/api/ticket/v1/new-ticket')
        .set('Cookie',global.mockCookie())
        .send({
            title:'my second ticket',
            price: 25
        });
        const update = {
            id:'5f59fdf125ea0066c86c05af', // some random valid ticket id but doenot exists in db 
            userId:ticket2.body.ticket.userId,
            title:'my ticket',
            version: ticket2.body.ticket.version
        };
        const updateRes = await global.server().put('/api/ticket/v1/edit-ticket')
        .set('Cookie',global.mockCookie()) 
        .send({...update});
        expect(updateRes.status).toBe(404);
        expect(updateRes.body.errors[0].message).toEqual("No such ticket exists to update");
    });
    it('should update the ticket if all parameters are valid',async()=>{
        const ticket2 = await global.server().post('/api/ticket/v1/new-ticket')
        .set('Cookie',global.mockCookie())
        .send({
            title:'my second ticket',
            price: 25
        });
        const update = {
            id:ticket2.body.ticket.id,
            userId:ticket2.body.ticket.userId,
            title:'my ticket',
            version: ticket2.body.ticket.version
        };
        const updateRes = await global.server().put('/api/ticket/v1/edit-ticket')
        .set('Cookie',global.mockCookie()) 
        .send({...update});
        expect(updateRes.status).toBe(201);
        expect(updateRes.body.ticket.title).toEqual('my ticket');
    });
    it('publishes an event',async ()=>{
        const ticket2 = await global.server().post('/api/ticket/v1/new-ticket')
        .set('Cookie',global.mockCookie())
        .send({
            title:'my second ticket',
            price: 25
        });
        const update = {
            id:ticket2.body.ticket.id,
            userId:ticket2.body.ticket.userId,
            title:'my ticket',
            version: ticket2.body.ticket.version
        };
        await global.server().put('/api/ticket/v1/edit-ticket')
        .set('Cookie',global.mockCookie()) 
        .send({...update}).expect(201);
        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
    it('rejects the request if the ticket is reserved',async()=>{
        const ticket2 = await global.server().post('/api/ticket/v1/new-ticket')
        .set('Cookie',global.mockCookie())
        .send({
            title:'my second ticket',
            price: 25
        });
        // reserve ticket by setting the orderId property
        const update = {
            id:ticket2.body.ticket.id,
            userId:ticket2.body.ticket.userId,
            version: ticket2.body.ticket.version,
            orderId: new ObjectID()
        };
        const up = await global.server().put('/api/ticket/v1/edit-ticket')
        .set('Cookie',global.mockCookie()) 
        .send({...update});
        // try updating the reserved ticket
        const update1 = {
            id:up.body.ticket.id,
            userId:up.body.ticket.userId,
            price:500,
            version: up.body.ticket.version,
        };
        const res = await global.server().put('/api/ticket/v1/edit-ticket')
        .set('Cookie',global.mockCookie()) 
        .send({...update1}).expect(400);
        expect(res.status).toBe(400);
        expect(res.body.errors[0].message).toEqual('Cannot edit a reserved ticket');
    })
});
