import Attendance from '../models/attendance.js'
import Utils from '../utils/utils.js'
import Employee from '../models/employees.js'
import moment from 'moment'

const addAllAttendances = async (req, res) => {
    const attendanceData = Utils.getAttendance(req.body.data)
    const employees = await Employee.find()
    const data = attendanceData.map((attendance) => {
        const employee = employees.find(
            (emp) => parseInt(attendance['AC-No.']) === emp.machine_no
        )

        let clockInTime = moment(attendance['Clock In'], 'HH:mm')
        let clockInEndTime = moment('12:00', 'HH:mm')

        let clockOutTime = moment(attendance['Clock Out'], 'HH:mm')
        let clockOutEndTime = moment('19:00', 'HH:mm')

        if (employee) {
            let attendanceObj = {
                name: attendance.Name,
                date: new Date(attendance.Date),
                late: attendance.Late,
                clock_In: attendance['Clock In'],
                clock_Out: attendance['Clock Out'],
                absent: attendance.Absent,
                week: attendance.week,
                sum_over_time: attendance.SumOverTime,
                employee_id: employee._id,
            }
            if (attendance['Clock In']) {
                if (
                    clockInEndTime.diff(clockInTime, 'minutes') < 0 ||
                    clockOutEndTime.diff(clockOutTime, 'minutes') > 120
                ) {
                    return { ...attendanceObj, status: 'Half leave' }
                } else if (clockInEndTime.diff(clockInTime, 'minutes') < 105) {
                    return { ...attendanceObj, status: 'Late' }
                } else {
                    return { ...attendanceObj, status: 'On time' }
                }
            } else {
                return { ...attendanceObj, status: 'Full leave' }
            }
        }
    })
    let result = data.filter((item) => item)
    try {
        const bulkData = result.map((each) => ({
            updateOne: {
                filter: { employee_id: each.employee_id, date: each.date },
                update: { $set: { ...each } },
                upsert: true,
            },
        }))
        await Attendance.bulkWrite(bulkData)
        res.status(200).json({
            message: 'Attendance Add Sucessfully',
            payload: result,
            success: true,
        })
    } catch (error) {
        res.status(200).json({
            message: error.message,
            success: false,
        })
    }
}

const deleteAttendance = async (req, res) => {
    try {
        const result = await Attendance.deleteMany()
        res.status(200).json({
            message: 'Attendance Deleted Sucessfully',
            payload: result,
            success: true,
        })
    } catch (error) {
        res.status(200).json({
            message: error.message,
            success: false,
        })
    }
}

const getAttendanceByMonth = async (req, res) => {
    const filter = {}
    const startOfMonth = moment(req.body.month).clone().startOf('month')
    const endOfMonth = moment(req.body.month).clone().endOf('month')

    filter.date = { $lte: endOfMonth, $gte: startOfMonth }
    if (req.body.status?.length > 0) {
        filter.status = { $in: req.body.status }
    }
    if (req.body.employee) {
        filter.employee_id = req.body.employee
    }
    try {
        const result = await Attendance.find(filter)
        return res.status(200).json({
            message: 'Attendance fetch Sucessfully',
            payload: result,
            success: true,
        })
    } catch (error) {
        res.status(200).json({
            message: error.message,
            success: false,
        })
    }
}

const getLateArrivalByMonth = async (req, res) => {
    const filter = {}
    const startOfMonth = moment(
        `${new Date().getFullYear() + Utils.monthsLong[req.body.month]}`
    )
        .clone()
        .startOf('month')
    const endOfMonth = moment(
        `${new Date().getFullYear() + Utils.monthsLong[req.body.month]}`
    )
        .clone()
        .endOf('month')

    filter.date = { $lte: endOfMonth, $gte: startOfMonth }
    if (req.body.status?.length > 0) {
        filter.status = { $in: req.body.status }
    }
    if (req.body.employee) {
        filter.employee_id = req.body.employee
    }
    try {
        const result = await Attendance.find(filter)
        const attendence = result.filter(
            (data) => data.status == 'Late' && data.employee_id == req.params.id
        )
        const late_arrival = attendence.map((late) => {
            return {
                date:
                    late.date.getDate() +
                    '-' +
                    Utils.monthFullNames[late.date.getUTCMonth()] +
                    '-' +
                    late.date.getFullYear(),
                arrival_time: moment(`${late.clock_In}`, 'hh:mm').format(
                    'hh:mm a'
                ),
                departure_time:
                    late.clock_Out === ''
                        ? `Not Checkout`
                        : moment(`${late.clock_Out}`, 'hh:mm').format(
                              'hh:mm a'
                          ),
            }
        })
        return res.status(200).json({
            message: 'Late Arrivals Fetched Succesfully',
            payload: late_arrival,
            success: true,
        })
    } catch (error) {
        res.status(200).json({
            message: error.message,
            success: false,
        })
    }
}

const updateAttendance = async (req, res) => {
    const { id, exempt, reason } = req.body

    try {
        const result = await Attendance.findByIdAndUpdate(
            {
                _id: id,
            },
            {
                exempt: exempt,
                reason: reason,
            },
            { new: true }
        )
        return res.status(200).json({
            message: 'Attendance Updated Succesfully',
            payload: result,
            success: true,
        })
    } catch (error) {
        res.status(200).json({
            message: error.message,
            success: false,
        })
    }
}

export default {
    addAllAttendances,
    deleteAttendance,
    getAttendanceByMonth,
    updateAttendance,
    getLateArrivalByMonth,
}
