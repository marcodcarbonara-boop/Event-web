const mongoose= require('mongoose')

const Schema = mongoose.Schema

const eventSchema= new Schema({
    title:{
        type: String, 
        required: true
    },
    date:{
        type: Date,
        required: true,
        expires: 86400
    },
    time:{ 
        type: String, 
        required: true 
    },
    location:{
        type: String,
        required: true
    },
    mapsUrl:{
        type: String,
        required: false 
    },
    description:{
        type :String,
        required: false
    },
    maxParticipants:{ 
        type: Number,
        required: true,
        min: 1 },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true 
    },
    interestedUsers: [
        { type: Schema.Types.ObjectId, ref: 'User' }]
}, {timestamps: true})

module.exports = mongoose.model('Event', eventSchema)

