import useRequest from '../../hooks/useRequest';
import {useEffect} from 'react';
import Router from 'next/router';

export default function SignOut(){
    const {doRequest,errors} = useRequest(
        {
            url:'/api/auth/v1/sign-out',
            method:'delete',
            onSuccess: ()=> Router.push('/')
        } 
        );
    useEffect(()=>{
        doRequest();
    },[]);
    return  <>
    {errors}
    </>
}