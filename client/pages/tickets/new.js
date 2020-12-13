
import { useState } from 'react';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const newTicket = ({currentUser})=>{

    const [title,setTitle] = useState('');
    const [price,setPrice] = useState('');

    const {doRequest,errors} = useRequest({
        url:'/api/ticket/v1/new-ticket',
        method:'post',
        body:{title,price},
        onSuccess:()=> Router.push('/')
    });
    const submitHandler = async (e)=>{
        e.preventDefault();
        const data = await doRequest();    
    }
    const onBlur = ()=>{
        const value = parseFloat(price);
        if(isNaN(value)){
            return;
        }
        setPrice(value.toFixed(2));
    }
    return <div>
        <h1>Create a Ticket</h1>
        <form onSubmit={submitHandler}>
            <div className="form-group">
                <label>Title</label>
                <input 
                    className="form-control" 
                    onChange={(e)=>setTitle(e.target.value)} 
                    value={title}
                />
            </div>
            <div className="form-group">
                <label>Price</label>
                <input 
                    className="form-control" 
                    onChange={(e)=>setPrice(e.target.value)} 
                    onBlur= {onBlur} // triggered when user clicks inside the input and deselects it by clicking outside the input
                    value={price}
                />
            </div>
            {errors}
            <button className="btn btn-primary">Submit</button>
        </form>
    </div>
}; 

export default newTicket;
