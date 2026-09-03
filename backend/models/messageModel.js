const mongoose= require('mongoose')


const Schema = mongoose.Schema

const messageSchema = new Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    reciverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        default: null
    },
    eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null
    },
    text:{
        type: String
    },
    image:{
        type: String, 
    },
    video:{
        type: String 
    },
}, {timestamps: true})

module.exports = mongoose.model('Message', messageSchema)
