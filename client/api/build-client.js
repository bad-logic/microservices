import axios from 'axios';

const urls = {
        // 'server': "http://<ingress-service-name>.<namespace-name>.svc.cluster.local", // for kubernetes
        'server':'http://reverse-proxy', // for docker-compose
        'browser':''
}


export default function buildClient(req){
    if(typeof window === 'undefined' ){
        // WE ARE ON SERVER
        return axios.create({
            baseURL:urls.server,
            headers:req.headers //  headers includes hosts cookies and all 
        });
   }else{
       // WE ARE ON BROWSER
    //    return axios.create({
    //        baseURL: urls.browser
    //    });
    return axios.create();
   }     
}