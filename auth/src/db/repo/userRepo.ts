import {userSchema} from '../schema/userSchema';
import {BadRequestError} from '@rbtickets/sharedlib';

let userCollection:any;

export class UserRepo{
    static async init(db:any){
        if(userCollection) return;
        try{
            const val = await db.listCollections({},{nameOnly: true}).toArray();
            const collections = val.map((e:any) =>  e.name);
            if(collections.includes('user')){
                userCollection = await db.collection('user');
            }else{
                userCollection  = await db.createCollection('user',{validator:{
                    $jsonSchema:userSchema
                }});
               await userCollection.createIndex('email',{unique:true});
            }
        }catch(err){
            throw err;
        }
    }
    static async addUser(email:string,username:string,password:string):Promise<any>{
        try{
            const newUser = {email,username,password};
            const user = await userCollection.insertOne(newUser);
            return user.ops[0];
        }catch(err){
            if(err.code === 11000){
                throw new BadRequestError(`Email:${email} is already in use`);
            }
            throw err;
        }
    }
    static async findUserByEmail(email:string):Promise<any>{
        try{
            const user = await userCollection.findOne({email:email});
            return user;
        }catch(err){
            throw err;
        }
    }

    static mapDocToObj({_id:id,password, ...rest}):any{
        return {id,...rest};
    }
}