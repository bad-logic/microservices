import express from 'express';
import {json} from 'body-parser';
import {RouterHandlers} from './routes';
import {handleError,handleResourceNotFound} from '@rbtickets/sharedlib';
import cookieSession from 'cookie-session';

const app = express();
// traffic is proxied througn ingress-nginx 
// making express aware that it is behind a proxy of ingress-nginx
// making express trust the proxy
app.set('trust-proxy',true);

app.use(json());

// secure: true is not working may be because i'm using http.createServer
// and this is a http server not https so maybe check this issue out
app.use(cookieSession({
    signed:false, // turning off encryption just incase we write microservices in diff languages
    // secure: true, // used for https only
    // secure : process.env.NODE_ENV !== "test" // jest sets the NODE_ENV to test
}));

app.use('/api',RouterHandlers);

// 404 Errors
app.use(handleResourceNotFound());

// general Error handler
app.use(handleError());

export {app as requestHandler};