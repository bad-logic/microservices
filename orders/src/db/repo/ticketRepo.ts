import {ticketSchema} from '../schema/ticketSchema';
import {ObjectID} from 'mongodb';
let orderCollection:any;

export class TicketRepo{
    static async init(db:any){
        if(orderCollection) return;
        try{
            const val = await db.listCollections({},{nameOnly: true}).toArray();
            const collections = val.map((e:any) =>  e.name);
            if(collections.includes('ticket')){
                orderCollection = await db.collection('ticket');
            }else{
                orderCollection  = await db.createCollection('ticket',{validator:{
                    $jsonSchema:ticketSchema
                }});
            }
        }catch(err){
            throw err;
        }
    }

    static async createTicket(id:string,title:string,price:number,userId:string):Promise<any>{
        try{
            const newTicket = {_id:new ObjectID(id),title,price,userId,version:0};
            const ticket = await orderCollection.insertOne(newTicket);
            return ticket.ops[0];
        }catch(err){
            throw err;
        }
    }

    static async getTicketById(id:string):Promise<any>{
        try{
            const isValid = ObjectID.isValid(id);
            if(!isValid) return null;
            return await orderCollection.findOne({_id:new ObjectID(id)});
        }catch(err){
            throw err;
        }
    }
    // static async getTicketByIdAndVersion(id:string,version:number):Promise<any>{
    //     try{
    //         const isValid = ObjectID.isValid(id);
    //         if(!isValid) return null;
    //         return await orderCollection.findOne({_id:new ObjectID(id),version:version});
    //     }catch(err){
    //         throw err;
    //     }
    // }

    static async getTickets():Promise<any>{
        try{
            return await orderCollection.find({}).toArray();
        }catch(err){
            throw err;
        }
    }

    static async updateTicket(id:string,updatedInfo:object):Promise<any>{
        try{
            const res = await orderCollection.updateOne({_id:new ObjectID(id)},{$set:updatedInfo,$inc:{'version':1}});
            if(res.result.nModified) return await this.getTicketById(id);
            // this keyword inside static methods refers to the class not the instance
            return null;
        }catch(err){
            throw err;
        }
    }

    static mapDocToObj({_id:id,price,title,userId}):any{
        return {id,price,title,userId};
    }
}