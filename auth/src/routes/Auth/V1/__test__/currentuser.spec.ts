

describe('testing the GET /api/auth/v1/current-use route',()=>{
    
    it('should return null info if not logged in',async()=>{
        const result = await global.server().get('/api/auth/v1/current-user').expect(200);
        expect(result.body.user).toEqual(null);
    });

    
    it('should return current user info if logged in',async()=>{
        const cookie = await global.signUp();
        const result = await global.server()
        .get('/api/auth/v1/current-user')
        .set('Cookie',cookie)
        .expect(200);
        expect(result.body.user).toBeDefined();
        expect(result.body.user.email).toBe('test@test.com');
    });

});