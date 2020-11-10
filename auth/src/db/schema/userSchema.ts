// jsonshema
export const userSchema = {
    bsonType: "object",
    required:["username","email","password"],
    properties:{
        _id:{},
        username:{
            bsonType: "string",
            description: "must be a string and is required"
        },
        email:{
            bsonType: "string",
            description: "must be a valid and unique email address"
        },
        password:{
            bsonType: "string",
            description:"must be a string and is required"
        }
    }
}