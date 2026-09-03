const express= require('express')

const{
    createEvent,
    getEvent,
    getEvents,
    deleteEvent,
    updateEvent,
    toggleInterest
}= require('../controllers/eventController')

const requireAuth = require('../middleware/requireAuth')

const router= express.Router()

//require auth for all event
router.use(requireAuth)


//get all
router.get('/', getEvents)

//get a single event 
router.get('/:id', getEvent)

//Post a new
router.post('/',createEvent)

//delete a event
router.delete('/:id', deleteEvent)

//updata a event

router.patch('/:id', updateEvent)

// inserisci negli interresati
router.patch('/:id/interest', toggleInterest)

module.exports= router