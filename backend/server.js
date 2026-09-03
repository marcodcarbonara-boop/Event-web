require('dotenv').config()

const cors =require("cors")
const express = require('express')
const http = require('http')
const mongosse= require('mongoose')
const eventRoutes =require('./routes/events')
const userRoutes = require('./routes/user')
const messageRoutes = require('./routes/messages')
const { Server } = require('socket.io')
const socketAuth = require('./middleware/socketAuth')
const socketController = require('./controllers/socketController')

//express app
const app= express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

//middleware
app.use(cors())
app.use(express.json())
// Middleware per verificare il JWT al momento della connessione Socket
io.use(socketAuth)


app.use((req, res, next)=>{
    console.log(req.path, req.method)
    next()
})


io.on('connection', (socket) => socketController(io, socket))


//react to request ROUTES
app.use('/api/events',eventRoutes)
app.use('/api/user',userRoutes)
app.use('/api/messages', messageRoutes)


app.get('/', (req, res)=>{
    res.json({mssg: 'Welcome to the app'})
})


//conect to database
mongosse.connect(process.env.MONGO_URI)
    .then(() =>{
        //lisen for requiest
        server.listen(process.env.PORT,()=>{
        console.log('connected to db & listening on port ', process.env.PORT)
    })

    })
    .catch((error)=>{
        console.log(error)
    })




