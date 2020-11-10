import jwt from 'jsonwebtoken';
import {BadRequestError} from '@rbtickets/sharedlib';
// process.env.JWT_SECRET_KEY! ; // adding ! to make ts happy also we already made 
// sure that secret key is already provided during starting the server

export class JWT {
    static generateJWT(payload:Object){
        return new Promise((resolve,reject)=>{
            jwt.sign(payload,process.env.JWT_SECRET_KEY! ,{expiresIn:'15m'},(err,token)=>{
                if(err) return reject(err); // bubbles up to express error handler and throws internal server error
                return resolve(token);
            }); 
        });
    }
    static verifyJWT(token:string){
        return new Promise((resolve,reject)=>{
            jwt.verify(token,process.env.JWT_SECRET_KEY! ,{ignoreExpiration:false},(err,decoded)=>{
                if(err) return reject(new BadRequestError('Bad token'));
                return resolve(decoded);
            });
        });
    }
    static decodeJWT(token:string){
        return new Promise((resolve,reject)=>{
            jwt.verify(token,process.env.JWT_SECRET_KEY! ,{ignoreExpiration:true},(err,decoded)=>{
                if(err) return reject(new BadRequestError('Bad token'));
                return resolve(decoded);
            });
        });
    }

}