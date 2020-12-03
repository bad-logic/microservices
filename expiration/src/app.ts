import {natsWrapper} from './nats-wrapper';
import {orderCreatedListener} from './events/listeners/order-created-listener';

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
    if(!process.env.EXPIRATION_REDIS_URI){
        throw new Error('ENV_VAR EXPIRATION_REDIS_URI not found');
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
        new orderCreatedListener(natsWrapper.client).listen();
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
    


