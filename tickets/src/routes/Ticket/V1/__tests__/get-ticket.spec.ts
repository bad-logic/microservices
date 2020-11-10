describe('testing GET api/ticket/v1/get-ticket/:id',()=>{

    it('return 404 if ticket not found',async ()=>{
        await global.server()
        .get('/api/ticket/v1/get-ticket/fakeid')
        .set('Cookie',global.mockCookie())
        .send()
        .expect(404);
    });

    it('return 200 if ticket found',async ()=>{
        const res = await global.server()
        .post('/api/ticket/v1/new-ticket')
        .set('Cookie',global.mockCookie())
        .send(
            {
                title:'Second ticket',
                price: 25
            });

        const res1 =  await global.server()
        .get(`/api/ticket/v1/get-ticket/${res.body.ticket.id}`)
        .set('Cookie',global.mockCookie())
        .send();
        expect(res1.status).toBe(200);
        expect(res1.body.ticket.title).toBe('Second ticket');
        expect(res1.body.ticket.price).toBe(25);
    });
});