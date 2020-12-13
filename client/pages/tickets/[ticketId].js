
import  useRequest from "../../hooks/useRequest";
import Router from 'next/router';

const ticketDetails = ({currentUser,ticket,networkErrors})=>{

    const {doRequest,errors} = useRequest({
        url:'/api/order/v1/new-order',
        method:'post',
        body:{
            ticketId:ticket?ticket.id:null
        },
        onSuccess:(data)=> Router.push('/orders/[orderId]',`/orders/${data.order.id}`) 
    });

    const onClickHandler = async (e)=>{
        e.preventDefault();
        await doRequest();
    }
           
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
                    <h1>{ticket.title}</h1>
                    <h4>Price: {ticket.price}</h4>
                    {errors}
                    <button onClick={onClickHandler} className="btn btn-primary">Purchase</button>
                </div>
        );
}; 




ticketDetails.getInitialProps = async (context,client,currentUser)=>{
    try{
        const data = await client.get('/api/ticket/v1/get-ticket/'+context.query.ticketId);
        return {ticket:data.data.ticket};
    }catch(err){
        console.log(err);
        return {networkErrors:err.response.data.errors};
    }
}

export default ticketDetails;
