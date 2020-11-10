import {requestHandler} from '../app';
import request  from 'supertest';


import {connect,clearCollections,disconnect} from './mongo';

declare global{
    namespace NodeJS{
        interface Global{
            signUp():Promise<string[]> ,
            server():any
        }
    }
}
global.signUp = async()=>{
    const username = 'test123'
    const email = 'test@test.com';
    const password = 'password';
    const confirmPassword = 'password';
    const response = await request(requestHandler)
    .post('/api/auth/v1/sign-up')
    .send({username,email,password,confirmPassword}).expect(201);
    return response.get('Set-Cookie');
}


global.server = ()=>{
    return request(requestHandler);
}

beforeAll(async ()=>{
    await connect();
});

beforeEach(async ()=>{
// delete all collections and its content
    await clearCollections();
});

afterAll(async ()=>{
    await disconnect();
});
