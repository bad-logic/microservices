import {orderSchema} from '../schema/orderSchema';
import {ObjectID} from 'mongodb';
import {OrderStatus} from '@rbtickets/sharedlib';

let orderCollection:any;

export class OrderRepo{
    
    static async init(db:any){
        if(orderCollection) return;
        try{
            const val = await db.listCollections({},{nameOnly: true}).toArray();
            const collections = val.map((e:any) =>  e.name);
            if(collections.includes('order')){
                orderCollection = await db.collection('order');
            }else{
                orderCollection  = await db.createCollection('order',{validator:{
                    $jsonSchema:orderSchema
                }});
            }
        }catch(err){
            throw err;
        }
    }

    static async createOrder(id:string,status:string,ticket:string,price:number,userId:string):Promise<any>{
        try{
            const newOrder = {_id:new ObjectID(id),status,ticket:new ObjectID(ticket),price,userId,version:0};
            const res = await orderCollection.insertOne(newOrder);
            return res.ops[0];
        }catch(err){
            throw err;
        }
    }

    static async getOrderById(id:string):Promise<any>{
        try{
            const isValid = ObjectID.isValid(id);
            if(!isValid) return null;
            return  await orderCollection.findOne({_id:new ObjectID(id)});
        }catch(err){
            throw err;
        }
    }

    static async cancelOrder(id:string):Promise<any>{
        try{
            // also check the version is valid or not before updating
            const res = await orderCollection.updateOne({_id:new ObjectID(id)},
            {$set:{status:OrderStatus.Cancelled},$inc:{'version':1}});
            if(res.result.nModified) return await this.getOrderById(id);
            return null;
        }catch(err){
            throw err;
        }
    }

    static mapDocToObj({_id:id, ...rest}):any{
        return {id,...rest};
    }
}