import Link from 'next/link';

const index = ({currentUser,orders,networkErrors})=>{

    const tableContent = ()=>{
        return orders.map(o=>{
                return (
                    <tr key={o.id}>
                        <td>{o.ticket.title}</td>
                        <td>{o.status}</td>
                        <td>{o.ticket.price}</td>
                        <td>
                        <Link href="/orders/[orderId]" as={`/orders/${o.id}`}>
                                <a className="nav-link">View</a>
                        </Link>
                        </td>
                    </tr>
                );
        });
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
                <h1>Your Orders</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Order Status</th>
                            <th>Price</th>
                            <th>Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent()}
                    </tbody>
                </table>
            </div>
        );
}; 



index.getInitialProps = async (context,client,currentUser)=>{
    try{
        const data = await client.get('/api/order/v1/get-orders');
        return {orders:data.data.orders};
    }catch(err){
        console.log(err);
        return {networkErrors:err.response.data.errors};
    }
}



export default index;