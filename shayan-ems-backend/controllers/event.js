import Event from '../models/event.js'
import Utils from '../utils/utils.js'

const getEvents = async (req, res) => {
    try {
        const event = await Event.find()
        res.status(200).json({
            message: 'Event fetched Successfully',
            payload: event,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const getEventbyId = async (req, res) => {
    const { eventId } = req.params
    const event = await Event.findOne({ _id: eventId })
    if (!event) {
        return res
            .status(200)
            .json({ message: 'No event found against this id', success: false })
    }

    try {
        res.status(200).json({
            message: 'Event fetched successfully',
            payload: event,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const deleteEvent = async (req, res) => {
    const { eventId } = req.params
    const event = await Event.findOne({ _id: eventId })
    if (!event) {
        return res
            .status(200)
            .json({ message: 'No event found against this id', success: false })
    }
    try {
        await Event.findByIdAndDelete({
            _id: eventId,
        })
        return res.status(200).json({
            message: 'Event deleted successfully',
            success: true,
            payload: eventId,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const updateEvent = async (req, res) => {
    const { eventId } = req.params
    try {
        const eventIdInDb = await Event.findById(eventId)
        if (!eventIdInDb) {
            return res.status(200).json({
                message: 'No Event found against this id',
                success: false,
            })
        }

        let updatedEvent = null
        if (req.body.event_date) {
            const d = new Date(`${req.body.event_date}`)
            let day = Utils.dayNames[d.getDay()]

            updatedEvent = {
                ...req.body,
                Date:
                    Utils.monthNames[d.getMonth()] +
                    ' ' +
                    d.getDate() +
                    ',' +
                    d.getFullYear(),
                Day: day,
            }
        } else {
            updatedEvent = { ...req.body }
        }

        const updated = await Event.findOneAndUpdate(
            {
                _id: eventId,
            },
            { $set: updatedEvent },
            { new: true }
        )
        return res.status(200).json({
            message: 'Event updated successfully',
            payload: updated,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const createEvent = async (req, res) => {
    const isEventExist = await Event.findOne({
        event_date: req.body.event_date,
    })
    if (isEventExist) {
        return res.status(200).json({
            message: 'Event with given date already exists',
            success: false,
        })
    }
    const d = new Date(`${req.body.event_date}`)
    let day = Utils.dayNames[d.getDay()]
    const event = {
        event: req.body.event,
        event_name: req.body.event_name,
        Date:
            Utils.monthNames[d.getMonth()] +
            ' ' +
            d.getDate() +
            ',' +
            d.getFullYear(),
        Day: day,
        event_date: req.body.event_date,
    }
    const newEvent = new Event(event)
    try {
        await newEvent.save()
        res.status(200).json({
            message: 'Event saved successfully',
            payload: event,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

export default {
    createEvent,
    getEvents,
    getEventbyId,
    deleteEvent,
    updateEvent,
}
