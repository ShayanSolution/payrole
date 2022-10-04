import express from 'express'
import Event from '../controllers/event.js'
const router = express.Router()

// Events Crud
router.get('/', Event.getEvents)
router.post('/create-event', Event.createEvent)
router.get('/:eventId', Event.getEventbyId)
router.put('/update-event/:eventId', Event.updateEvent)
router.get('/delete-event/:eventId', Event.deleteEvent)

export default router
