import {useState} from 'react';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

export default function signUp(){

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const {doRequest,errors} = useRequest(
        {
            url:'/api/auth/v1/sign-in',
            method:'post',
            body:{
                email:email,
                password:password
                },
            onSuccess: ()=> Router.push('/')
        } 
       );

    async function submitHandler(e){
        e.preventDefault();
        const data = await doRequest();    
    }

    return <form onSubmit={submitHandler}>
        <h1>signIn</h1>   
        <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" value = {email} onChange={e=>setEmail(e.target.value)} required/>
        </div>
        <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" value = {password} onChange={e=>setPassword(e.target.value)} required/>
        </div>
        { errors }
        <button className="btn btn-primary">Sign In</button>
    </form>
}