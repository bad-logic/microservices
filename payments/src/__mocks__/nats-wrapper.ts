// export const natsWrapper = {
//     client: {
//         publish:(subject:string,data:string,cb:()=>void)=>{  
//                cb();
//             }
//         },
// };

export const natsWrapper = {
    client:{
        publish: jest.fn().mockImplementation( // jest.fn() allows us to test this function,fn called or not check its args,
            (subject:string,data:string,cb:()=>void)=>{  
                    cb();
            })
    }
}