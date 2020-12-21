import http from 'http';
import {requestHandler} from './app';
import { MongoClient } from "mongodb";
import {UserRepo} from "./db/repo/userRepo";

function checkConfigs(){
    if(!process.env.JWT_SECRET_KEY){
        throw new Error('JWT_SECRET_KEY not found');
    }
    if(!process.env.AUTH_MONGO_URI){
        throw new Error('AUTH_MONGO_URI not found');
    }
    if(!process.env.SERVER_PORT){
        throw new Error('ENV_VAR SERVER_PORT not found');
    }
}
async function start(){
    try{
        checkConfigs();
        const client = await MongoClient.connect(process.env.AUTH_MONGO_URI!,{
          useNewUrlParser: true,
          useUnifiedTopology: true,
          poolSize: 10,
          wtimeout: 2500
        });
        const db = client.db('auth');
        await UserRepo.init(db);
        console.log('<<<Database connection established>>>');
        const server = http.createServer(requestHandler);
        server.listen(process.env.SERVER_PORT,()=>{
            console.log(`server listening at port ${process.env.SERVER_PORT}!!!!`);
        });
    }catch(err){
        console.error(err.stack)
        process.exit(1)
    }
}


if(require.main === module){
    start();
}
    


