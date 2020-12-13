
import  useRequest from "../../hooks/useRequest";
import {useState,useEffect} from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';

const orderDetails = ({currentUser,order,networkErrors})=>{
    
    const [timeLeft,setTimeLeft] = useState(-1); 

    useEffect(()=>{
        console.log('order',order);
        if(networkErrors) return;
        if(order.status==="cancelled" || order.status==="complete") return; // donot set interval for expired orders
        const findTimeLeft = ()=>{
            const tl = (new Date(order.expiresAt)-new Date())/1000; // seconds
            setTimeLeft(Math.round(tl));
        }
        findTimeLeft();//to make sure time is shown in the ui at first render since setInterval will
        // wait 1000 ms before setting the state and after that only time is rendered 
        // to test this enable fast 3G and test by commenting and uncommenting above line
        const tlIntervalId = setInterval(findTimeLeft,1000); // every 1000ms = 1 sec

        return ()=>{ // cleanup
            clearInterval(tlIntervalId); // clearing the setInterval before leaving the component
        }
    },[]);
    const {doRequest,errors} = useRequest({
        url:'/api/payments/v1/new-payment',
        method:'post',
        body:{
            orderId:order?order.id:null,
        },
        onSuccess:()=> Router.push('/orders')
    });
           
    return (
        networkErrors 
                ? 
                <div className="alert alert-danger" role="alert">
                    <ul className="my-0">
                        {
                            networkErrors.map((e,ind)=>{
                            return <li key={ind}>{e.message}</li>;
                            })
                        }
                    </ul>
                </div> 
                :
                <div>
                    {timeLeft<=0 ? 
                    <p> sorry!!! the order has expired</p>
                    :
                    <>
                        <h4>Purchasing {order.ticket.title}</h4>
                        <p>Time left to pay: {timeLeft}s </p>
                        {errors}
                        <StripeCheckout
                        token={({id})=>doRequest({token:id})}
                        stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
                        amount={order.ticket.price * 100} // converting to cents
                        email={currentUser.email}
                        />
                    </>
                    }
                </div>
        );
}; 




orderDetails.getInitialProps = async (context,client,currentUser)=>{
    try{
    console.log('stripe publish key',process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

        const data = await client.get('/api/order/v1/get-order/'+context.query.orderId);
        return {order:data.data.order};
    }catch(err){
        console.log(err);
        return {networkErrors:err.response.data.errors};
    }
}

export default orderDetails;
