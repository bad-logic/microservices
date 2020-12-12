import {requestHandler} from '../app';
import request  from 'supertest';
import jwt from 'jsonwebtoken';
import {connect,clearCollections,disconnect} from './mongo';
import { ObjectID } from 'mongodb';
jest.mock('../nats-wrapper.ts');
jest.mock('../stripe.ts');

declare global{
    namespace NodeJS{
        interface Global{
            mockCookie(id?:string):string[] ,
            server():any
        }
    }
}

global.mockCookie = (id?:string)=>{
    // Build a JWT Payload. {id,email,username}
    const payload = {
        id: id||new ObjectID().toHexString(),
        username : 'test123',
        email : 'test@test.com'
    }
    // create JWT
    const token = jwt.sign(payload,process.env.JWT_SECRET_KEY!,{expiresIn:'15m'});
    // Build Session object {jwt: my_jwt}
    const sess = {jwt:token};
    // turn that session into json string
    const sess_json = JSON.stringify(sess);
    // take that json and turn it into base64
    const base64 = Buffer.from(sess_json).toString('base64');
    // return a string that is the cookie with encoded data
    return [`express:sess=${base64}`]; // array supertest specific
}

global.server = ()=>{
    return request(requestHandler);
}

beforeAll(async ()=>{
    try{
        await connect();
    }catch(err){
        console.log(err);
    }
});

beforeEach(async ()=>{
    try{
        // delete all collections and its content
        await clearCollections();
        // jest stores data related to mocks so we need to clear it before each tests
        // so we can test these mocks seperately in each tests
        // for example if we write a mock function then jest records how many times it is called
        // so if we need to test the number of times it is called in each test. then we need to clear
        // the mocks since it contains records from all tests
        jest.clearAllMocks(); 
    }catch(err){
        console.log(err);
    }
});

afterAll(async ()=>{
    try{
        await disconnect();
    }catch(err){
        console.log(err);
    }
});




