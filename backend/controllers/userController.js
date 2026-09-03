const User= require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken=(_id)=>{
    return jwt.sign({_id}, process.env.SECRET, {expiresIn:'1w'})
}

//login user
const loginUser = async(req, res)=>{
    const {email, username, password} = req.body
    const loginInput = email|| username
    
     try{
        const user =await User.login(loginInput, password)

        //create a token

        const token = createToken(user._id)

        res.status(200).json({_id: user._id,email: user.email, username: user.username, token})
    } catch(error){
        res.status(400).json({error: error.message})
    }

}

//singup user
const signupUser = async(req, res)=>{

    const {email, username, password, confirmPassword} = req.body

    try{
        const user =await User.signup(email,username, password, confirmPassword)
        //create a token

        const token = createToken(user._id)
        res.status(200).json({_id: user._id,email: user.email, username: user.username, token})
    } catch(error){
        res.status(400).json({error: error.message})
    }
}

// Recupera tutti gli utenti eccetto quello attualmente autenticato
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('username email')
    res.status(200).json(users)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { signupUser, loginUser, getUsers }

