import {OrderStatus} from '@rbtickets/sharedlib';

export const orderSchema = {
    bsonType: "object",
    required:["status","userId","expiresAt","ticket"],
    properties:{
        _id:{},
        status:{
            bsonType: "string",
            enum:Object.values(OrderStatus),
            description: "must be a string and is required"
        },
        expiresAt:{
            bsonType: "date",
            description: "must be a date"
        },
        userId:{
            bsonType: "string",
            description:"must be a string and is required"
        },
        version:{
            bsonType: "number",
            description: "must be a number and is required"
        },
        ticket:{
            bsonType: "objectId",
            description:"must be an objectId and is required"
        }
    }
}