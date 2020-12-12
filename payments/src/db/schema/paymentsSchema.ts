export const paymentSchema = {
    bsonType: "object",
    required:["orderId","stripeId"],
    properties:{
        _id:{},
        orderId:{
            bsonType: "objectId",
            description:"must be an objectId and is required"
        },
        stripeId:{
            bsonType: "string",
            description:"must be a string and is required"
        }
    }
}