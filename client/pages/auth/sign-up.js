import {useState} from 'react';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

export default function signUp(){

    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setconfirmPassword] = useState('');

    const {doRequest,errors} = useRequest(
        {
            url:'/api/auth/v1/sign-up',
            method:'post',
            body:{
            username:username,
            email:email,
            password:password,
            confirmPassword:confirmPassword},
            onSuccess: ()=> Router.push('/')
        } 
       );

    async function submitHandler(e){
        e.preventDefault();
        const data = await doRequest();    
    }

    return <form onSubmit={submitHandler}>
        <h1>signup</h1>   
        <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-control" value = {username} onChange={e=>setUsername(e.target.value)} required/>
        </div>
        <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" value = {email} onChange={e=>setEmail(e.target.value)} required/>
        </div>
        <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" value = {password} onChange={e=>setPassword(e.target.value)} required/>
        </div>
        <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" className="form-control" value = {confirmPassword} onChange={e=>setconfirmPassword(e.target.value)} required/>
        </div>
        { errors }
        <button className="btn btn-primary">Sign Up</button>
    </form>
}