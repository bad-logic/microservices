import {MongoMemoryServer} from 'mongodb-memory-server';
import {MongoClient} from 'mongodb';
import {TicketRepo} from '../db/repo/ticketRepo';


let db:any;
let mongo:any;
let connection:any;


export const connect = async()=>{
    mongo = new MongoMemoryServer();
    connection = await MongoClient.connect(await mongo.getUri(),{
        useUnifiedTopology:true,
        useNewUrlParser:true
    });
    db = connection.db('tickets');
    await TicketRepo.init(db);
}

export const clearCollections = async ()=>{
     // delete all collections and its content
     const collections = await db.collections();
     // console.log('collections',collections);
     for(let coll of collections){
         await coll.deleteMany({});
     }
}

export const disconnect = async ()=>{
    await mongo.stop();
    await connection.close();
}