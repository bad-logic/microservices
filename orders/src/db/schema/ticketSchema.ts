export const ticketSchema = {
    bsonType: "object",
    required:["title","price"],
    properties:{
        _id:{},
        title:{
            bsonType: "string",
            description: "must be a string and is required"
        },
        price:{
            bsonType: "number",
            description: "must be a positive number and is required"
        },
        version:{
            bsonType: "number",
            description: "must be a positive number and is required"
        },
        orderId:{
            bsonType: "string",
            description: "must be a string and is required to reserve a ticket"
        }
    }
}