import 'bootstrap/dist/css/bootstrap.css';
// global css can be only imported in _app.js file.
// this is how next js works
import buildClient from '../api/build-client';
import Headers from '../components/headers';

// overriding next's default component
// creating custom default component 
// thus instead of using next's default component next will use our 
// this custom component and wrap our components with this component and render to screen 
const AppComponent = (props) =>{
    const {Component,pageProps,currentUser} = props;
    return <div>
        <Headers currentUser={currentUser}/>
        {/* Component is the page/component that is going to be rendered */}
        <div className="container">
            <Component currentUser={currentUser} {...pageProps}/> 
        </div>
    </div>
};

// ONCE THE GETINITIALPROPS FUNCTION IS INVOKED IN CUSTOM APP COMPONENT 
// IT WILL NOT BE INVOKED IN PAGE COMPONENTS
// SO WE NEED TO CATCH THE GETINITIALPROPS METHOD OF PAGE COMPONENTS
// AND INVOKE AND SEND OUT THE RESULTS
// FOR EVERY PAGE COMPONENTS THIS AppComponent is also executed/rendered
// SO ON ROUTING TO DIFFERENT PAGES THEIR GETINTIALPROPS WILL ALSO BE EXECUTED
// SINCE THIS APPCOMPONENT IS EXECUTED FOR ALL PAGES
AppComponent.getInitialProps = async (context)=>{

    const client = buildClient(context.ctx.req);
    const res = await client.get('/api/auth/v1/current-user');
    let pageProps={};
    // MANUALLY INVOKING THE GETINITIALPROPS OF THE PAGE COMPONENT
    // ALSO WE NEED TO CHECK IF THE GETINITIALPROPS FUNCTION EXISTS IN THAT PAGE
    if(context.Component.getInitialProps){
        pageProps = await context.Component.getInitialProps(
            context.ctx,
            client,
            res.data.user
        );
    }
    // IF NO GETINITIALPROPS DEFINED IN PAGES THEN EMPTY OBJECT WILL BE SENT ref: pageProps={}
    return {currentUser:res.data.user,pageProps};
}

// ARGUMENTS PROVIDE FOR PAGE COMPONENT AND CUSTOM APP COMPONENT in getInitialProps function
// context => {err,req,res,pathname,query,asPath,AppTree} for Page Component
// context => {AppTree, Component, router, ctx} for Custom App Component

export default AppComponent;

