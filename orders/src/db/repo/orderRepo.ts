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

    static async createOrder(status:string,expiresAt:Date,ticket:string,userId:string):Promise<any>{
        try{
            const newOrder = {status,expiresAt,ticket:new ObjectID(ticket),userId,version:0};
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
            const pipeline = [
                {
                    $match:{_id:new ObjectID(id)}
                },
                {
                    $addFields:{id:"$_id"}
                },
                {
                    $project:{_id:0}
                },
                {
                    $lookup:{
                        from: "ticket",
                        let:{'ticketId':'$ticket'},
                        pipeline:[
                            {
                                $match:{ $expr:{$eq:['$_id','$$ticketId']}}
                            },
                            {
                                $addFields:{id:"$_id"}
                            },
                            {
                                $project:{_id:0}
                            }
                        ],
                        as: "ticket"
                    }
                },
                {
                    $unwind:"$ticket"
                }
            ]
            const result = await orderCollection.aggregate(pipeline).toArray();
            return result[0];
        }catch(err){
            throw err;
        }
    }

    static async getReservedOrderByTicketId(tid:string):Promise<any>{
        try{
            const isValid = ObjectID.isValid(tid);
            if(!isValid) return null;
            return await orderCollection.findOne({
                ticket:tid,
                // orders with status other than cancelled is reserved
                // so returning that order with ticket id and is reserved
                status:{$ne:OrderStatus.Cancelled}
            });
        }catch(err){
            throw err;
        }
    }

    static async ticketIsReserved(tid:string):Promise<Boolean>{
        try{
            const reserved = await this.getReservedOrderByTicketId(tid);
            return !!reserved;
        }catch(err){
            throw err;
        }
    }

    static async getOrdersByUserId(userId:string):Promise<any>{
        try{
            const pipeline = [
                {
                    $match:{
                        userId:userId
                    }
                },
                {
                    $addFields: {id:"$_id"}
                },
                {
                    $project:{"_id":0}
                },
                {
                    $lookup:{
                        from:'ticket',
                        let: {'ticketId':'$ticket'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{$eq:['$_id','$$ticketId']}
                                }
                            },
                            {
                                $addFields: {id:"$_id"}
                            },
                            {
                                $project:{"_id":0}
                            }
                        ],
                        as:'ticket'
                    }
                },
                { $unwind: '$ticket' } // lookup returns array converting it to object
            ];
            return await orderCollection.aggregate(pipeline).toArray();
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

    static async completeOrder(id:string):Promise<any>{
        try{
            // also check the version is valid or not before updating
            const res = await orderCollection.updateOne({_id:new ObjectID(id)},
            {$set:{status:OrderStatus.Complete},$inc:{'version':1}});
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