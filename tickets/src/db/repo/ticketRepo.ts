import {ticketSchema} from '../schema/ticketSchema';
import {ObjectID} from 'mongodb';
let ticketCollection:any;

export class TicketRepo{
    static async init(db:any){
        if(ticketCollection) return;
        try{
            const val = await db.listCollections({},{nameOnly: true}).toArray();
            const collections = val.map((e:any) =>  e.name);
            if(collections.includes('ticket')){
                ticketCollection = await db.collection('ticket');
            }else{
                ticketCollection  = await db.createCollection('ticket',{validator:{
                    $jsonSchema:ticketSchema
                }});
            }
        }catch(err){
            throw err;
        }
    }

    static async createTicket(title:string,price:number,userId:string):Promise<any>{
        try{
            const newTicket = {title,price,userId,version:0}; // version starts from 0 and increases on each update
            const ticket = await ticketCollection.insertOne(newTicket);
            return ticket.ops[0];
        }catch(err){
            throw err;
        }
    }

    static async getTicketById(id:string):Promise<any>{
        try{
            const isValid = ObjectID.isValid(id);
            if(!isValid) return null;
            return await ticketCollection.findOne({_id:new ObjectID(id)});
        }catch(err){
            console.log('err',err);
            throw err;
        }
    }

    static async getTickets():Promise<any>{
        try{
            return await ticketCollection.find({}).toArray();
        }catch(err){
            throw err;
        }
    }

    static async updateTicket(id:string,userId:string,version:number,updatedInfo:object):Promise<any>{
        try{
            const res = await ticketCollection.updateOne({_id:new ObjectID(id),userId:userId,version:version},{$set:updatedInfo,$inc:{'version':1}});
            if(res.result.nModified) return await ticketCollection.findOne({_id:new ObjectID(id)});
            return null;
        }catch(err){
            throw err;
        }
    }
    static async reserveTicketById(id:string,updatedInfo:object):Promise<any>{
        try{
            const res = await ticketCollection.updateOne({_id:new ObjectID(id)},{$set:updatedInfo,$inc:{'version':1}});
            if(res.result.nModified) return await ticketCollection.findOne({_id:new ObjectID(id)});
            return null;
        }catch(err){
            throw err;
        }
    }
    static async unreserveTicketById(id:string):Promise<any>{
        try{
            const res = await ticketCollection.updateOne({_id:new ObjectID(id)},{$unset:{"orderId":""},$inc:{'version':1}});
            if(res.result.nModified) return await ticketCollection.findOne({_id:new ObjectID(id)});
            return null;
        }catch(err){
            throw err;
        }
    }

    static mapDocToObj({_id:id,...rest}):any{
        return {id,...rest};
    }
}