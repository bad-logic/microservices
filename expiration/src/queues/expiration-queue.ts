import Queue from 'bull';
import {ExpirationCompletePublisher} from '../events/publishers/expiration-complete-publisher';
import {natsWrapper} from '../nats-wrapper';

interface Payload{
    orderId:string;
}

const expirationQueue = new Queue<Payload>('order:expiration',{
    redis:{
        host: process.env.EXPIRATION_REDIS_URI
    }
});


expirationQueue.process(async(job)=>{
    new ExpirationCompletePublisher(natsWrapper.client).publish({...job.data});
});


export {expirationQueue};