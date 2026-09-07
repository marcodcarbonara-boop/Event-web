const Event = require('../models/eventModel')

const mongoose= require('mongoose')

//get all Event
const getEvents= async (req, res)=>{
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const event= await Event.find({date: {$gte: yesterday}}).populate('user_id','username').populate('interestedUsers', 'username').sort({createdAt: -1})
    res.status(200).json(event)
}


//get a single event
const getEvent = async (req, res)=>{
    const { id }= req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'Evento non trovato'})
    }
    
    const event= await Event.findById(id)

    if(!event){
        return res.status(404).json({error: 'Evento non trovato'})
    }
    res.status(200).json(event)
}


//create a new event
const createEvent = async (req, res)=>{
    const{title, date,time, location, mapsUrl, description,maxParticipants} = req.body

    let emptyFields=[]
    
    if(!title){
        emptyFields.push('title')
    }

    if(!date){
        emptyFields.push('date')
    }
    if(!time){
        emptyFields.push('time')
    }
    if(!location){
        emptyFields.push('location')
    }
    if(!maxParticipants){
        emptyFields.push('maxParticipants')
    }
    if(emptyFields.length >0){
        return res.status(400).json({error: 'Please fiends all the fiends', emptyFields})
    }
    const eventDate = new Date(date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

    if (eventDate < today) {
        return res.status(400).json({ error: 'La data dell\'evento non può essere nel passato.' })
    }



    //add doc to DB
    try{
        const user_id = req.user._id
        const event = await Event.create({title, date, time, location,mapsUrl, description,maxParticipants, user_id})
        const populatedEvent= await event.populate('user_id','username')
        res.status(200).json(populatedEvent)
    } catch(error){
        res.status(400).json({error: error.message})
    }
}


//delete a event
const deleteEvent= async (req, res)=>{
    const{id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'Evento non trovato'})
    }

    const event =await Event.findById( id)
    if(!event){
        return res.status(400).json({error: 'Evento non trovato'})
    }
    if(event.user_id.toString()!== req.user._id.toString()){
        return res.status(403).json({ error: 'Non hai i permessi per eliminare questo evento' })
    }
    await Event.findOneAndDelete({ _id: id })

    res.status(200).json(event)
}


//update a event

const updateEvent = async(req,res)=>{
        const{id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'Evento non trovato'})
    }

    const event= await Event.findOneAndUpdate({_id: id},
        {...req.body},{new: true}
    )

    if(!event){
        return res.status(400).json({error: 'Evento non trovato'})
    }

    res.status(200).json(event)
    
}

const toggleInterest = async (req, res) => {
  const { id } = req.params
  const userId = req.user._id

  const event = await Event.findById(id)
  if (!event) {
    return res.status(404).json({ error: 'Evento non trovato' })
  }

  // Controlla se l'utente si è già loggato
  const alreadyInterested = event.interestedUsers.includes(userId)

  if (alreadyInterested) {
    // Rimuove l'utente se si era già loggato
    event.interestedUsers = event.interestedUsers.filter(
      (uid) => uid.toString() !== userId.toString()
    )
  } else {
    if (event.maxParticipants && event.interestedUsers.length >= event.maxParticipants) {
        return res.status(400).json({ error: 'Posti esauriti per questo evento!' })
    }
    // Aggiunge l'utente
    event.interestedUsers.push(userId)
  }

  await event.save()
  const populatedEvent = await Event.findById(event._id)
    .populate('user_id', 'username')
    .populate('interestedUsers', 'username')
  res.status(200).json(populatedEvent)
}


module.exports = {
    getEvents,
    getEvent,
    createEvent,
    deleteEvent,
    updateEvent,
    toggleInterest
}