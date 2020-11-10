import axios from 'axios';

const urls = {
    auth:{
        'server':'http://auth-clusterip-srv:3000',
        'browser':''
    }
}


export default function buildClient(req,service){
    if(typeof window === 'undefined' ){
        // WE ARE ON SERVER
        return axios.create({
            baseURL:urls[service].server,
            headers:req.headers //  headers includes hosts cookies and all 
        });
   }else{
       // WE ARE ON BROWSER
    //    return axios.create({
    //        baseURL: urls[service].browser
    //    });
    return axios.create();
   }     
}