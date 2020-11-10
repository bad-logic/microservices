import axios from 'axios';
import {useState} from 'react';


export default function useRequest({url,method,body,onSuccess}){

    const [errors,setErrors] = useState(null);

    const visualizeError = (errs)=>{
            setErrors(<div className="alert alert-danger" role="alert">
            <ul className="my-0">
            {
                errs.map((e,ind)=>{
                    if(e.field==='confirmPassword') return <li key={ind}>Confirm Password should match the password</li>;
                    return <li key={ind}>{e.message}</li>;
                })
            }
            </ul>
        </div>);
    };
    const doRequest = async()=>{
        try{
            const resp = await axios[method](url,body);
            setErrors(null);
            if(onSuccess) onSuccess(resp.data); 
            return resp.data;
        }catch(err){
            console.log(err);
            visualizeError(err.response.data.errors);
        }
    }
    return { doRequest, errors };
}