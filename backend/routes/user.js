const express =require('express')

//controller function

const {loginUser, signupUser , getUsers} =require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

//login
router.post('/login', loginUser)

//singup
router.post('/signup', signupUser)
// Rotta autenticata per ottenere gli utenti per la chat privata
router.get('/', requireAuth, getUsers)


module.exports =router