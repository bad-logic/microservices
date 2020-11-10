describe('testing the POST /api/auth/v1/sign-up route',()=>{

    it('returns a 201 status code on successfull signup',async ()=>{
       await global.server()
       .post('/api/auth/v1/sign-up')
       .send({
           username:'teste123',
           email:'test@test.com',
           password:'password',
           confirmPassword:'password'
       })
       .expect(201);
    });
    
    it('returns a 400 status code on invalid email', async ()=>{
        await global.server()
       .post('/api/auth/v1/sign-up')
       .send({
           username:'test123',
           email:'testnail.com',
           password:'password',
           confirmPassword:'password'
       })
       .expect(400);
    });
    
    it('returns a 400 status code on invalid password', async ()=>{
        await global.server()
       .post('/api/auth/v1/sign-up')
       .send({
           username:'test123',
           email:'test@test.com',
           password:'pass',
           confirmPassword:'pass'
       })
       .expect(400);
    });
    
    it('returns a 400 status code on password and confirmPassword mismatch', async ()=>{
        await global.server()
       .post('/api/auth/v1/sign-up')
       .send({
           username:'test123',
           email:'test@test.com',
           password:'password',
           confirmPassword:'password123'
       })
       .expect(400);
    });
    
    
    it('returns a 400 status code on missing one of the params', async ()=>{
        await global.server()
       .post('/api/auth/v1/sign-up')
       .send({
           email:'test@test.com',
           password:'password',
           confirmPassword:'password'
       })
       .expect(400);
       await global.server()
       .post('/api/auth/v1/sign-up')
       .send({
           username:'test123',
           password:'password'
       })
       .expect(400);
       const res = await global.server()
       .post('/api/auth/v1/sign-up')
       .send({})
       .expect(400);
    });
    
    it('returns a 400 status code on duplicate email',async ()=>{
        await global.server()
        .post('/api/auth/v1/sign-up')
        .send({
            username:'test123',
            email:'test@test.com',
            password:'password',
            confirmPassword:'password'
        })
        .expect(201);
        await global.server()
        .post('/api/auth/v1/sign-up')
        .send({
            username:'test123',
            email:'test@test.com',
            password:'password',
            confirmPassword:'password'
        })
        .expect(400);
     });
    
     it('sets a cookie after successfull signup',async()=>{
        const res = await global.server()
        .post('/api/auth/v1/sign-up')
        .send({
            username:'test123',
            email:'test@test.com',
            password:'password',
            confirmPassword:'password'
        });
        expect(res.status).toBe(201);
        expect(res.get("Set-Cookie")).toBeDefined();
     });

});