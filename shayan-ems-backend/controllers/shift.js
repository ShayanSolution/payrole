import Shift from '../models/shift.js'
import moment from 'moment'

const getShift = async (req, res) => {
    const shift = await Shift.find()
    try {
        res.status(200).json({
            message: 'Shift fetched Successfully',
            payload: shift,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const deleteShift = async (req, res) => {
    const { shiftId } = req.params
    try {
        await Shift.findByIdAndDelete({
            _id: shiftId,
        })
        return res.status(200).json({
            message: 'Shift deleted successfully',
            success: true,
            payload: shiftId,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const updateShift = async (req, res) => {
    const { shiftId } = req.params
    try {
        const employeeInDb = await Shift.findById(shiftId)
        if (!employeeInDb) {
            return res.status(200).json({
                message: 'No Shift found against this id',
                success: false,
            })
        }
        const updated = await Shift.findOneAndUpdate(
            {
                _id: shiftId,
            },
            { $set: req.body },
            { new: true }
        )
        return res.status(200).json({
            message: 'Shift updated successfully',
            payload: updated,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const createShift = async (req, res) => {
    const isShiftExist = await Shift.findOne({
        shift_name: req.body.shift_name,
    })
    if (isShiftExist) {
        return res.status(200).json({
            message: 'Shift with given title already exists',
            success: false,
        })
    }

    const shift = {
        shift_name: req.body.shift_name,
        employee_shift: req.body.employee_shift,
        working_hours: req.body.working_hours,
        start_time: moment(`${req.body.start_time}`, 'hh:mm').format('hh:mm a'),
        end_time: moment(`${req.body.end_time}`, 'hh:mm').format('hh:mm a'),
        no_of_hours: req.body.no_of_hours,
        working_days: req.body.working_days,
    }
    let newShift = new Shift(shift)
    try {
        await newShift.save()
        res.status(200).json({
            message: 'Shift saved successfully',
            payload: newShift,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

export default {
    createShift,
    getShift,
    deleteShift,
    updateShift,
}
