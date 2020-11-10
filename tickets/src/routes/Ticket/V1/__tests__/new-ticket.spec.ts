import {natsWrapper} from '../../../../nats-wrapper';
// since we defined to user mock file in setup.ts we will be getting natsWrapper from mock folder
describe('testing the POST /api/v1/tickets/new-ticket route',()=>{
    
    it('has a route handler listening to the route',async()=>{
        const val = await global.server()
        .post('/api/ticket/v1/new-ticket')
        .send({});
        expect(val.status).not.toEqual(404);
    });
    
    it('route can be accessed only by signed in user',async()=>{
        const val = await global.server()
        .post('/api/ticket/v1/new-ticket')
        .send({});
        expect(val.status).toEqual(401);
    });
    
    it('does not return 401 if user is signed in',async()=>{
        const cookie = global.mockCookie();
        const val = await global.server()
        .post('/api/ticket/v1/new-ticket')
        .set('Cookie',cookie)
        .send({});
        expect(val.status).not.toEqual(401);
    });
    
    it('returns an error on invalid title',async()=>{
        const cookie = global.mockCookie();
        const val = await global.server()
        .post('/api/ticket/v1/new-ticket')
        .set('Cookie',cookie)
        .send({
            title:'',
            price:11
        });
        const val1 = await global.server()
        .post('/api/ticket/v1/new-ticket')
        .set('Cookie',cookie)
        .send({
            price:11
        });
        expect(val.status).toEqual(400);
        expect(val.body.errors).toBeDefined();
        expect(val.body.errors[0].field).toBe('title');
        expect(val1.status).toEqual(400);
        expect(val1.body.errors).toBeDefined();
        expect(val1.body.errors[0].field).toBe('title');
    });
    
    it('returns an error on invalid price',async()=>{
        const cookie = global.mockCookie();
        await global.server()
        .post('/api/ticket/v1/new-ticket')
        .set('Cookie',cookie)
        .send({
            title:'first ticket',
            price:-20
        }).expect(400);
        await global.server()
        .post('/api/ticket/v1/new-ticket')
        .set('Cookie',cookie)
        .send({
            title:'first ticket',
            price:0
        }).expect(400);
        const val = await global.server()
        .post('/api/ticket/v1/new-ticket')
        .set('Cookie',cookie)
        .send({
            title:'first ticket',
            price:''
        });
        const val1 = await global.server()
        .post('/api/ticket/v1/new-ticket')
        .set('Cookie',cookie)
        .send({
            title:'second ticket'
        });
        expect(val.status).toEqual(400);
        expect(val.body.errors).toBeDefined();
        expect(val.body.errors[0].field).toBe('price');
        expect(val1.status).toEqual(400);
        expect(val1.body.errors).toBeDefined();
        expect(val1.body.errors[0].field).toBe('price');
    });
    
    it('creates a ticket for valid inputs',async()=>{
        const cookie = global.mockCookie();
        const res = await global.server()
        .post('/api/ticket/v1/new-ticket')
        .set('Cookie',cookie)
        .send({
            title:'second ticket',
            price: 25
        });
        expect(res.status).toBe(201);
        expect(res.body.msg).toBe('new ticket created');
        expect(res.body.ticket).toBeDefined();
        expect(res.body.ticket.id).toBeDefined();
        expect(res.body.ticket.userId).toBe('5f59ecbf71d30bf128fb2606');
    });

    it('publishes an event',async ()=>{
        const cookie = global.mockCookie();
        await global.server()
        .post('/api/ticket/v1/new-ticket')
        .set('Cookie',cookie)
        .send({
            title:'second ticket',
            price: 25
        }).expect(201);
        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
});
