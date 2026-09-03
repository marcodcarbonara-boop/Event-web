import { useState } from "react"
import { useLogin } from "../hooks/useLogin"
const Login =()=>{
    const[identifier, setIdentifier]=useState('')
    const[password, setPassword]=useState('')
    const [showPassword, setShowPassword] = useState(false)

    const{login,error,isLoading}= useLogin()

    const handleSubmit =async(e)=>{
        e.preventDefault()
        await login(identifier, password)
    }

    return(
        <form className="login" onSubmit={handleSubmit}>
            <h3>Log in</h3>
            <label>Email or Username: *</label>
            <input
                type="text"
                onChange={(e)=> setIdentifier(e.target.value)}
                value={identifier}
            />
            <label>Password: *</label>
                <div className="passwordInputConteiner">
                    <input
                    type={showPassword ? 'text': "password"}
                    onChange={(e)=> setPassword(e.target.value)}
                    value={password}
                    />
                    <span className="material-symbols-outlined toggle-password"
                    onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                </div>
            <label>* campi obbligatori</label>

            <button disabled={isLoading}>Log In</button>
            {error && <div className="error">{error}</div>}

        </form>
    )
}

export default Login