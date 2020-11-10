// import axios from 'axios';

import buildClient from '../api/build-client';

// IF YOU ARE RUNNING YOUR NEXTJS SERVER IN A DIFFERENT DOMAIN OR DIF KUBERNETES CLUSTER
// AND SERVICES IN ANOTHER DOMAIN OR K-CLUSTER THEN WE WILL HAVE DIFFERENT DOMAIN FOR 
// SERVICES AND CLIENT IN SUCH CASE WE DON'T NEED TO WORRY ABOUT WHO EXECUTES getInitialProps
// FUNCTION SINCE IN BOTH CASES WE SEND REQUEST TO SAME DOMAIN WHICH IS DIFFERENT FROM THE 
// CLIENT DOMAIN

// THIS ISSUE IS ONLY KUBERNETES RELATED
// NOTE
// ANY REQUEST FROM INSIDE THE REACT COMPONENT WILL BE ISSUED BY THE CLIENT BROWSER
// ANY REQUEST INSIDE GETINITIALPROPS MAY BE EXECUTED FROM BOTH SERVER OR THE CLIENT BROWSER
// GETINITIALPROPS
// CASE: INITIATED BY NEXTJS SERVER
// 1. ON HARD REFRESH 
// 2. CLICKING THE LINK FROM DIFFERENT DOMAIN
// 3. TYPING URL INTO ADDRESS BAR

// CASE: INITIATED BY CLIENT BROWSER
// NAVIGATING OR ROUTING FROM ONE PAGE TO ANOTHER WHILE INSIDE THE APP

const index = ({currentUser})=>{
    return <h1>Index</h1>
}; 

// specific to next js
// code inside getInitialProps function will be executed inside nextjs server which is in kubernets cluster
// or may be from the client browser depends on the situation noted in above note

// if this network request is made from next js server running inside the kubernetes cluster
// and next js server is also running in the same cluster then we need to connect to the
// auth service from the nextjs server
// TWO WAYS TO CONNECT BETWEEN NEXTJS SERVER AND AUTH SERVICE

// first since they are in same cluster and within same namespace we could simply
// connect using their clusterip service name but with the risk of exposing the
// info about our cluster services to the client

// second solution will be to call the ingress-nginx from nextjs server which contains 
// all the logic that will route us to the corresponding service automatically
// but the ingress-nginx is created in diff namespace than our services which are
// created in default namespace. service within same namespace can be accessed with service name
// but cross namespace communication is a different case

// CROSS NAMESPACE COMMUNICATION CAN BE DONE AS
// http://service-name.namespace-name.svc.cluster.local;
// or if this syntax is difficult to remember you can also create a external service name
// that maps to this long name


// BELOW CASE ORIGINATES ONLY WHEN THE BROWSER HAS STORED COOKIES FOR THAT DOMAIN
// IF NO COOKIES FOR THAT DOMAIN ARE STORED THEN WE DON'T HAVE TO WORRY ABOUT IT

// Another issue we are going to run into when network request done by nextjs server is cookies
// cookies are sent automatically on each request by the browser
// so on the request for the index.js page the browser sends cookie in the headers to nextjs server
// thus we need a way to catch this cookie and forward it to the auth service current-user route
// which depends on the cookies to return the current user

//  index.getInitialProps = async ({req})=>{
//      let res;
//      if(typeof window === 'undefined' ){
//          // window object exists only inside the browser
//          // so code inside this block will not be executed by browser
//          // res = await axios.get('http://ingress-nginx-controller-admission.kube-system.svc.cluster.local/api/auth/v1/current-user');
         
//          // above will not work since ingress-nginx may have diff routing rules for different domains
//          // so we also need to specify domain names and ingress-nginx will know which domain rules
//          // to apply for routing
//          // const cookie = req.get('Set-Cookie');
         
//         // res = await axios.get(
//         //     `http://ingress-nginx-controller-admission.kube-system.svc.cluster.local/api/auth/v1/current-user`,
//         //     {
//         //         headers:{
//         //             Host:'tickets.dev'
//         //         }
//         //     }
//         // );
//         res = await axios.get(
//             // cross namespace communication not working so directly using clusterIp service
//             `http://ingress-nginx-controller-admission.kube-system.svc.cluster.local/api/auth/v1/current-user`,
//             {
//                 headers: req.headers //  headers includes hosts cookies and all 
//             }
//         );
//     }else{
//         // below code will be executed by the browser only
//         res = await axios.get('/api/auth/v1/current-user');
//         // the above request won't work if executed by nextjs server. 
//         // if there is no host address then the axios will  add the current host address 
//         // in this case it is localhost=> which is the container that is running 
//         // nextjs server inside kubernetes cluster. so it will reach out to
//         // localhost:80/api/auth/v1/current-user. port 80 since we didn.t specify port 
//         // it will use 80 by default and inside that container we don't have any
//         // service listening at port 80
//     }     
//     return res.data;
//  }

index.getInitialProps = async (context)=>{
    const client = buildClient(context.req,'auth');
    const res = await client.get('/api/auth/v1/current-user');
    return res.data;
}
export default index;