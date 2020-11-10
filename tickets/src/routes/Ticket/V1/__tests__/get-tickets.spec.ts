describe('testing GET /api/ticket/v1/get-tickets',()=>{
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
    it('should return a list of tickets',async()=>{
        await Promise.all([createTicket(),createTicket(),createTicket()]);
        const res = await global.server().get('/api/ticket/v1/get-tickets');
        expect(res.status).toBe(200);
        expect(res.body.tickets instanceof Array).toBe(true);
        expect(res.body.tickets.length).toBe(3);
    });
});