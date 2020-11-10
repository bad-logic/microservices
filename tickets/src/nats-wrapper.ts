import nats,{Stan} from 'node-nats-streaming';
import {randomBytes} from 'crypto';

class NatsWrapper{
    private _client?:Stan;
    
    get client(){
        if(!this._client) throw new Error('Cannot access nat client before connecting');
        return this._client;
    }

    connect(clusterId:string,clientId:string,url:string):Promise<any>{
        this._client = nats.connect(clusterId,clientId,{url:url});

        return new Promise((resolve,reject)=>{
            this.client.on('connect',_=>{
                return resolve();
            });
            this.client.on('err',(err)=>{
                return reject(err);
            });
        });

    }


}


const natsWrapper = new NatsWrapper(); // creating a single instance and exporting

export {natsWrapper};