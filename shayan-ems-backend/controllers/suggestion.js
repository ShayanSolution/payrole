import Suggestion from '../models/suggestion.js'
import Employee from '../models/employees.js'
import Utils from '../utils/utils.js'
import moment from 'moment'

const getSuggestions = async (req, res) => {
    const isEmployeenotExist = await Suggestion.findOne({
        employee_id: req.params.id,
    })
    if (!isEmployeenotExist) {
        return res.status(200).json({
            message: 'No Suggestions Found Against This Employee',
            success: false,
        })
    }
    const suggestion = await Suggestion.find({
        employee_id: req.params.id,
    })
    try {
        res.status(200).json({
            message: 'Event fetched Successfully',
            payload: suggestion,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const createSuggestions = async (req, res) => {
    const employee_name = await Employee.findOne({
        _id: req.params.id,
    })
    const date =
        new Date().getDate() +
        ' ' +
        Utils.monthNames[new Date().getMonth()] +
        ',' +
        new Date().getFullYear()
    const suggestion = {
        employee_id: req.params.id,
        employee_name: employee_name.first_name + ' ' + employee_name.last_name,
        suggestion_message: req.body.suggestion_message,
        suggestion_status: req.body.suggestion_status,
        suggestion_date: date,
    }
    const newSuggestion = new Suggestion(suggestion)
    try {
        await newSuggestion.save()
        res.status(200).json({
            message: 'Suggestion saved successfully',
            payload: suggestion,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}
const getallSuggestions = async (req, res) => {
    const filter = {}
    const startOfMonth = moment(req.body.month).clone().startOf('month')
    const endOfMonth = moment(req.body.month).clone().endOf('month')
    filter.createdAt = { $lte: endOfMonth, $gte: startOfMonth }
    if (req.body.suggestion_status?.length > 0) {
        filter.suggestion_status = { $in: req.body.suggestion_status }
    }
    if (req.body.employee) {
        filter.employee_id = req.body.employee
    }
    try {
        const suggestion = await Suggestion.find(filter)
        return res.status(200).json({
            message: 'Suggestions Fetched Successfully',
            payload: suggestion,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const deleteSuggestion = async (req, res) => {
    const { suggestionId } = req.params
    try {
        await Suggestion.findOneAndDelete(
            {
                _id: suggestionId,
            },
            {
                isSoftDeleted: true,
                deleted_at: new Date(),
                updated_at: new Date(),
            }
        )
        return res.status(200).json({
            message: 'Suggestion Deleted Successfully',
            success: true,
            payload: suggestionId,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const updateSuggestion = async (req, res) => {
    const { suggestionId } = req.params
    try {
        const updated = await Suggestion.findOneAndUpdate(
            {
                _id: suggestionId,
            },
            { $set: req.body },
            { new: true }
        )
        return res.status(200).json({
            message: 'Suggestion Updated Successfully',
            payload: updated,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

export default {
    createSuggestions,
    getSuggestions,
    updateSuggestion,
    deleteSuggestion,
    getallSuggestions,
}
