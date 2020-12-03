
import Link from 'next/link';

export default ({currentUser})=>{

    const links = [
        !currentUser && {label:'Sign-In', href:'/auth/sign-in'},
        !currentUser && {label:'Sign-Up', href:'/auth/sign-up'},
        currentUser && {label:'Sign-Out', href:'/auth/sign-out'}
    ].map(it=>{
            return  it && <li key={it.label} className="nav-item"> 
                        <Link href={it.href}>
                            <a className="nav-link">{it.label}</a>
                        </Link>
                    </li> 
        });
    return (
        <nav className="navbar navbar-light bg-light">
            <Link href="">
                <a className="navbar-brand">TICKET</a>
            </Link>
            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {links}
                </ul>
            </div>
        </nav>
    );
}