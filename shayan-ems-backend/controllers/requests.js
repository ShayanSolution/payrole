import Request from '../models/requests.js'
import Employee from '../models/employees.js'
import moment from 'moment'
import Utils from '../utils/utils.js'

const getRequests = async (req, res) => {
    const isEmployeenotExist = await Request.findOne({
        employee_id: req.params.id,
    })
    if (!isEmployeenotExist) {
        return res.status(200).json({
            message: 'No Requests Found Against This Employee',
            success: false,
        })
    }
    const request = await Request.find({
        employee_id: req.params.id,
    })
    try {
        res.status(200).json({
            message: 'Event fetched Successfully',
            payload: request,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const getallRequestes = async (req, res) => {
    const filter = {}
    const startOfMonth = moment(req.body.month).clone().startOf('month')
    const endOfMonth = moment(req.body.month).clone().endOf('month')
    filter.createdAt = { $lte: endOfMonth, $gte: startOfMonth }
    if (req.body.request_status?.length > 0) {
        filter.request_status = { $in: req.body.request_status }
    }
    if (req.body.employee) {
        filter.employee_id = req.body.employee
    }
    try {
        const requests = await Request.find(filter)
        return res.status(200).json({
            message: 'Requests Fetched Successfully',
            payload: requests,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const createRequests = async (req, res) => {
    const date =
        new Date().getDate() +
        ' ' +
        Utils.monthNames[new Date().getMonth()] +
        ',' +
        new Date().getFullYear()
    const employee = await Employee.findOne({ _id: req.params.id })
    const request = {
        employee_id: req.params.id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        request_title: req.body.request_title,
        request_purpose: req.body.request_purpose,
        request_desc: req.body.request_desc,
        request_status: req.body.request_status,
        request_date: date,
    }
    const newRequest = new Request(request)
    try {
        await newRequest.save()
        res.status(200).json({
            message: 'Request saved successfully',
            payload: request,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const deleteRequest = async (req, res) => {
    const { requestId } = req.params
    try {
        await Request.findOneAndDelete(
            {
                _id: requestId,
            },
            {
                isSoftDeleted: true,
                deleted_at: new Date(),
                updated_at: new Date(),
            }
        )
        return res.status(200).json({
            message: 'Request Deleted Successfully',
            success: true,
            payload: requestId,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const updateRequest = async (req, res) => {
    const { requestId } = req.params
    try {
        const updated = await Request.findOneAndUpdate(
            {
                _id: requestId,
            },
            { $set: req.body },
            { new: true }
        )
        return res.status(200).json({
            message: 'Request Updated Successfully',
            payload: updated,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

export default {
    createRequests,
    getallRequestes,
    deleteRequest,
    updateRequest,
    getRequests,
}
