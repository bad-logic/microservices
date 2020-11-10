describe('testing the POST /api/auth/v1/sign-in route', ()=>{
    
    it('returns 400 status code with unregistered email ',async()=>{
        const res = await global.server()
        .post('/api/auth/v1/sign-in')
        .send({
            email:'roshan@gmail.com',
            password:'password'
        });
        expect(res.status).toBe(400);
    });
    
    it('fails to login if password is incorrect',async()=>{
        await global.signUp();
        const res = await global.server()
        .post('/api/auth/v1/sign-in')
        .send({
            email:'test@test.com',
            password:'passdfword'
        });
        expect(res.status).toBe(400);
    });
    
    it('sets a cookie after successful sign in',async()=>{
        await global.signUp();;
        const res = await global.server()
        .post('/api/auth/v1/sign-in')
        .send({
            email:'test@test.com',
            password:'password'
        }).expect(200);
        expect(res.get('Set-Cookie')).toBeDefined();
    });

});