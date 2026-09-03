import { useState } from "react"
import { useSignup } from "../hooks/useSignup"

const Signup =()=>{
    const[email, setEmail]= useState('')
    const[username, setUsername]=useState('')
    const[password, setPassword]=useState('')
    const [confirmPassword, setConfirmPassword]= useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const{signup, error, isLoading}=useSignup()
    
    const handleSubmit =async(e)=>{
        e.preventDefault()
        await signup(email, username, password, confirmPassword)
    }

    return(
        <form className="signup" onSubmit={handleSubmit}>
            <h3>Sign up</h3>
            <label>Email: *</label>
                <input
                    type="email"
                    onChange={(e)=> setEmail(e.target.value)}
                    value={email}
                />
            <label>Username: *</label>
                <input
                    type="text"
                    onChange={(e)=> setUsername(e.target.value)}
                    value={username}
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
            <label>Conferma Password *:</label>
                <div className="passwordInputConteiner">
                    <input
                        type={showConfirmPassword ? 'text': "password"}
                        onChange={(e)=> setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                    />
                    <span className="material-symbols-outlined toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                </div>
            <label>* campi obbligatori</label>

            <button disabled={isLoading}>Sign In</button>
            {error && <div className="error">{error}</div>}

        </form>
    )
}

export default Signup