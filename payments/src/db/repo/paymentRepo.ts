import {paymentSchema} from '../schema/paymentsSchema';
import {ObjectID} from 'mongodb';

let paymentCollection:any;

export class PaymentRepo{
    
    static async init(db:any){
        if(paymentCollection) return;
        try{
            const val = await db.listCollections({},{nameOnly: true}).toArray();
            const collections = val.map((e:any) =>  e.name);
            if(collections.includes('payment')){
                paymentCollection = await db.collection('payment');
            }else{
                paymentCollection  = await db.createCollection('payment',{validator:{
                    $jsonSchema:paymentSchema
                }});
            }
        }catch(err){
            throw err;
        }
    }

    static async createPayment(orderId:string,stripeId:string):Promise<any>{
        try{
            const newPaymentRecord = {orderId:new ObjectID(orderId),stripeId};
            const res = await paymentCollection.insertOne(newPaymentRecord);
            return res.ops[0];
        }catch(err){
            throw err;
        }
    }

    static async getPaymentById(id:string):Promise<any>{
        try{
            const isValid = ObjectID.isValid(id);
            if(!isValid) return null;
            return  await paymentCollection.findOne({_id:new ObjectID(id)});
        }catch(err){
            throw err;
        }
    }

    static async getPaymentByOrderId(orderId:string):Promise<any>{
        try{
            const isValid = ObjectID.isValid(orderId);
            if(!isValid) return null;
            return  await paymentCollection.findOne({orderId:new ObjectID(orderId)});
        }catch(err){
            throw err;
        }
    }

    // static async getPaymentByChargeId(stripeId:string):Promise<any>{
    //     try{
    //         return  await paymentCollection.findOne({stripeId:stripeId});
    //     }catch(err){
    //         throw err;
    //     }
    // }

    static mapDocToObj({_id:id, ...rest}):any{
        return {id,...rest};
    }
}