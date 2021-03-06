import http from 'http';
import {requestHandler} from './app';
import { MongoClient } from "mongodb";
import {TicketRepo} from "./db/repo/ticketRepo";
import {natsWrapper} from './nats-wrapper';
import {OrderCancelledListener} from './Events/listeners/order-cancelled-listener';
import {OrderCreatedListener} from './Events/listeners/order-created-listener';

function checkConfigs(){
    if(!process.env.NATS_URL){
        throw new Error('ENV_VAR NATS_URL not found');
    }
    if(!process.env.NATS_CLUSTER_ID){
        throw new Error('ENV_VAR NATS_CLUSTER_ID not found');
    }
    if(!process.env.NATS_CLIENT_ID){
        throw new Error('ENV_VAR NATS_CLIENT_ID not found');
    }
    if(!process.env.JWT_SECRET_KEY){
        throw new Error('ENV_VAR JWT_SECRET_KEY not found');
    }
    if(!process.env.TICKETS_MONGO_URI){
        throw new Error('ENV_VAR TICKETS_MONGO_URI not found');
    }
    if(!process.env.SERVER_PORT){
        throw new Error('ENV_VAR SERVER_PORT not found');
    }
}

async function start(){
    try{
        checkConfigs();
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID!,
            process.env.NATS_CLIENT_ID!,
            process.env.NATS_URL!
        );      
        console.log('connected to nats server');
        natsWrapper.client.on('close',()=>{
            // this is executed if we get disconnected from nats
            // for example if nats server goes offline
            console.log('nats disconnected');
            process.exit();
        });
        // listening to the Order created and cancelled events
        // that will be eventually fired or emitted by the nats streaming server
        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();
        const client = await MongoClient.connect(process.env.TICKETS_MONGO_URI!,{
          useNewUrlParser: true,
          useUnifiedTopology: true,
          poolSize: 10,
          wtimeout: 2500
        });
        console.log('<<<Database connection established>>>');
        const db = client.db('tickets');
        await TicketRepo.init(db);
        const server = http.createServer(requestHandler);
        server.listen(process.env.SERVER_PORT,()=>{
            console.log(`server listening at port ${process.env.SERVER_PORT}!!!!`);
        });
        process.on('SIGINT',()=> natsWrapper.client.close());
        process.on('SIGTERM',()=> natsWrapper.client.close());
    }catch(err){
        console.error(err.stack);
        // process.exit() 0=> success exit 1=> failure exit
        process.exit();
    }
}


if(require.main === module){
    start();
}
    


