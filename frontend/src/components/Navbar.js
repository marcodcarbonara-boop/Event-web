import { Link } from "react-router-dom"
import { useLogout } from "../hooks/useLogout"
import{useAuthContext} from '../hooks/useAuthContext'
const Navbar=()=>{
    const{logout} = useLogout()
    const{user}= useAuthContext()

    const handleClick=()=>{
        logout()

    }
    return(
        <header>
            <div className="container">
                <Link to={"/"}>
                   <h1>Events Bari</h1>
                </Link>
                <nav>
                
                    {user &&(<div className="user-menu">
                        <Link to="/" className="create-link">
                        <span className="material-symbols-outlined">Home </span></Link>
                        <span>{user.username}</span>
                        <Link to="/chat"> Chat</Link>
                        <Link to="/create" className="create-link">
                            Crea Evento
                        </Link>
                        <button onClick={handleClick}>Log out</button>
                    </div>
                    )}
                    {!user && (<div className="nav-links">
                        <Link to='/login'>Login</Link>
                        <Link to='/signup'>Signup</Link>
                    </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Navbar