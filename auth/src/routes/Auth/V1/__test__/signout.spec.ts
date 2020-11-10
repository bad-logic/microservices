describe('testing DELETE /api/auth/v1/sign-out route',()=>{
    
    it('should clear the cookie on signout',async()=>{
        await global.signUp(); // signup or signin both sets the cookie
        const res = await global.server().delete('/api/auth/v1/sign-out').expect(200);
        expect(res.get('Set-Cookie')[0]).toEqual("express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly");
    });

});

