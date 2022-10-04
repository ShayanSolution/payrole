import Leave from '../models/leave.js'
import Employee from '../models/employees.js'
import Attendance from '../models/attendance.js'
import Contract from '../models/contract.js'
import Utils from '../utils/utils.js'
import moment from 'moment'

const createMonthlyQuota = async (req, res) => {
    try {
        const employees = await Employee.find({ isSoftDeleted: false })
        const date = new Date(req.body.date)

        await Leave.deleteMany({
            type: 'monthly quota',
            date_end: date,
        })

        const monthlyQuota = employees
            .filter((employee) => employee.contract === 'Permanent')
            .map((item) => {
                return {
                    employee_id: item._id,
                    type: 'monthly quota',
                    status: 'accepted',
                    approved_at: date,
                    approved_by: 'admin',
                    no_of_days: 1.5,
                    date_start: date,
                    date_end: date,
                    date_join: date,
                    reason: `Monthly quota granted for ${date.toLocaleString(
                        'default',
                        {
                            month: 'long',
                        }
                    )} ${date.getFullYear()}`,
                }
            })
        await Leave.insertMany(monthlyQuota)
        return res.status(200).send({
            message: `Succesfully Added Monthly Quota for ${req.body.date}`,
            payload: monthlyQuota,
            success: true,
        })
    } catch (error) {
        return res.send({ message: error.message, success: false })
    }
}

const deleteMonthlyQuota = async (req, res) => {
    try {
        const date = new Date(req.body.date)
        const result = await Leave.deleteMany({
            type: 'monthly quota',
            date_end: date,
        })
        return res.status(200).send({
            message: `Succesfully Deleted ${result.deletedCount} records of month ${req.body.date}`,
            success: true,
        })
    } catch (error) {
        return res.send({ message: error.message, success: false })
    }
}

const balanceLeaves = async (req, res) => {
    try {
        const employees = await Employee.find({ isSoftDeleted: false })
        const date = new Date(req.body.date)
        const leaves = await Leave.find()
        employees.forEach(async (employee) => {
            const emp_leaves = leaves.filter((leave) =>
                leave.employee_id.equals(employee._id)
            )
            let leave_count = emp_leaves.reduce(function (pre, curr) {
                return pre + curr.no_of_days
            }, 0)
            const balance = {
                employee_id: employee._id,
                type: 'Balance',
                status: 'accepted',
                approved_at: date,
                approved_by: 'admin',
                no_of_days: -leave_count,
                date_start: date,
                date_end: date,
                date_join: date,
                reason: `Balance Added for ${date.toLocaleString('default', {
                    month: 'long',
                })} ${date.getFullYear()}`,
            }
            const newLeave = new Leave(balance)
            await newLeave.save()
        })
        res.status(200).json({
            message: 'Successfully balance all the leaves',
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const balanceSingleEmployeeLeave = async (req, res) => {
    const date = new Date(
        `${new Date().getFullYear()}-${new Date().getMonth()}`
    )

    const leaves = await Leave.find({ employee_id: req.body._id })
    let leave_count = leaves.reduce(function (pre, curr) {
        return pre + curr.no_of_days
    }, 0)

    const balance = {
        employee_id: req.body._id,
        type: 'Balance',
        status: 'accepted',
        approved_at: date,
        approved_by: 'admin',
        no_of_days: -leave_count,
        date_start: date,
        date_end: date,
        date_join: date,
        reason: `Balance Added for ${date.toLocaleString('default', {
            month: 'long',
        })} ${date.getFullYear()}`,
    }
    const newLeave = new Leave(balance)
    await newLeave.save()
    return res.status(200).json({
        message: 'Successfully balance all the leaves',
        success: true,
    })
}

const getLeaves = async (req, res) => {
    const filter = {}
    if (req.body.status?.length > 0) {
        filter.status = { $in: req.body.status }
    }

    if (req.body.employee) {
        filter.employee_id = req.body.employee
    }

    try {
        const leaves = await Leave.find(filter)
            .sort({ date_start: -1 })
            .populate('employee_id')
        return res.status(200).json({
            message: 'Leaves fetched Successfully',
            payload: leaves,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const getEmployeeAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({
            type: { $nin: ['monthly quota', 'Balance'] },
            employee_id: req.body.id,
            status: 'pending',
        }).populate('employee_id')
        const editedLeaves = leaves.map((leave) => {
            return {
                _id: leave._id,
                employee_id: leave.employee_id,
                type: leave.type,
                no_of_days: -leave.no_of_days,
                date_join: leave.date_join,
                reason: leave.reason,
                status: leave.status,
                createdAt:
                    leave.createdAt.getDate() +
                    '-' +
                    Utils.monthNames[leave.createdAt.getUTCMonth()] +
                    '-' +
                    leave.createdAt.getFullYear(),
                updatedAt:
                    leave.updatedAt.getDate() +
                    '-' +
                    Utils.monthNames[leave.createdAt.getUTCMonth()] +
                    '-' +
                    leave.createdAt.getFullYear(),
                date_start:
                    leave.date_start.getDate() +
                    '-' +
                    Utils.monthNames[leave.date_start.getUTCMonth()] +
                    '-' +
                    leave.date_start.getFullYear(),
                date_end:
                    leave.date_end.getDate() +
                    '-' +
                    Utils.monthNames[leave.date_end.getUTCMonth()] +
                    '-' +
                    leave.date_end.getFullYear(),
            }
        })
        return res.status(200).json({
            message: 'Leaves fetched Successfully',
            payload: editedLeaves,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const createLeave = async (req, res) => {
    const { no_of_days, date_start, date_end, employee_id } = req.body
    const employee = await Employee.findOne({ _id: employee_id })
    const contract = await Contract.findOne({ _id: employee.contract_id })
        .sort({ createdAt: -1 })
        .limit(1)
    const leaves = await Leave.find({ employee_id })
    const allLeaves = leaves
        .filter(
            (leave) =>
                leave.status !== 'exempted' && leave.status !== 'rejected'
        )
        .reduce((pre, curr) => pre + curr.no_of_days, 0)

    if (
        contract?.contract === 'Resignation' ||
        -allLeaves >= employee?.yearly_quota
    ) {
        if (new Date(`${req.body.date_start}`) < new Date(contract.ended_at)) {
            req.body.status = 'rejected'
        }
    }
    const leave = leaves.filter(
        (leave) => leave.date_start.getTime() === new Date(date_start).getTime()
    )
    if (leave.length > 0) {
        return res.status(200).json({
            message: 'You already applied leave for this date',
            success: false,
        })
    }
    const start = new Date(date_start)
    const end = new Date(date_end)
    if (end < start) {
        return res.status(400).json({
            message: 'End date should be after Start date',
            success: false,
        })
    }
    if (start.getMonth() !== end.getMonth()) {
        return res.status(200).json({
            message: 'You cannot create leave with next month',
            success: false,
        })
    } else {
        const leave = {
            ...req.body,
            no_of_days: -no_of_days,
        }
        let newLeave = new Leave(leave)
        try {
            await newLeave.save()
            Leave.populate(
                newLeave,
                { path: 'employee_id' },
                function (err, leave) {
                    if (err) {
                        return res
                            .status(200)
                            .json({ message: err.message, success: false })
                    }
                    const payload = {
                        message: 'Leave added successfully',
                        payload: leave,
                        success: true,
                    }
                    global.io.emit('update-leaves', payload)
                    return res.status(200).json(payload)
                }
            )
        } catch (error) {
            return res
                .status(200)
                .json({ message: error.message, success: false })
        }
    }
}

const updateLeave = async (req, res) => {
    const { leaveId } = req.params
    try {
        const employeeInDb = await Leave.findById(leaveId)
        if (!employeeInDb) {
            return res.status(200).json({
                message: 'No Leave found against this id',
                success: false,
            })
        }
        const employee = await Employee.findById(employeeInDb.employee_id)
        const allLeaves = await Leave.find({
            employee_id: employee._id,
            status: { $ne: 'exempted' },
        })
        const allLeavesLength = -allLeaves.reduce(
            (pre, curr) => pre + curr.no_of_days,
            0
        )
        if (
            allLeavesLength > employee?.yearly_quota &&
            req.body.status === 'granted'
        ) {
            return res.status(200).json({
                message: 'No quota remaining',
                success: false,
            })
        }
        const updated = await Leave.findOneAndUpdate(
            {
                _id: leaveId,
            },
            { $set: req.body },
            { new: true }
        ).populate('employee_id')
        return res.status(200).json({
            message: 'Leave updated successfully',
            payload: updated,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const deleteLeave = async (req, res) => {
    const { leaveId } = req.params
    try {
        await Leave.findByIdAndDelete({
            _id: leaveId,
        })
        return res.status(200).json({
            message: 'Leave deleted successfully',
            success: true,
            payload: leaveId,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const deleteAllLeaves = async (req, res) => {
    try {
        const result = await Leave.deleteMany()
        return res.status(200).json({
            message: 'Successfully all Leaves',
            success: true,
            payload: result,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const getMonthlyRecord = async (req, res) => {
    try {
        const employee = await Employee.findOne({ _id: req.params.id })
        const contract = await Contract.findOne({ _id: employee.contract_id })
        const leaves = await Leave.find({
            type: { $nin: ['monthly quota', 'Balance'] },
            employee_id: req.params.id,
        }).populate('employee_id')

        var current_date = new Date()
        current_date.setMonth(current_date.getMonth() - 3)
        const current_year_leaves = leaves.filter(
            (data) =>
                data.date_start >= current_date.getUTCFullYear() &&
                data.status != 'rejected'
        )
        const used_leaves = current_year_leaves
            .map((item) => item.no_of_days)
            .reduce((prev, curr) => prev + curr, 0)
        let unpaidleaves = leaves
            .filter(
                (l) =>
                    l.status === 'rejected' &&
                    new Date(Utils.getFirstAndLastDayofMonth().first) <
                        new Date(l.date_end) &&
                    new Date(l.date_end) <
                        new Date(Utils.getFirstAndLastDayofMonth().last)
            )
            .reduce(function (pre, curr) {
                return pre + curr.no_of_days
            }, 0)
        var last_leave
        leaves.length > 0
            ? (last_leave = leaves[leaves.length - 1].date_start)
            : (last_leave = 'No Leaves')
        const filter = {}
        const first_day = Utils.getFirstAndLastDayofMonth().first
        const last_day = Utils.getFirstAndLastDayofMonth().last
        filter.date = { $lte: last_day, $gte: first_day }
        filter.status = 'Late'
        filter.employee_id = req.params.id
        const late_arrivals = await Attendance.find(filter)
        if (contract !== null && contract.contract === 'Resignation') {
            return res.status(200).json({
                message: 'Leaves fetched Successfully',
                payload: {
                    used_leaves: Math.abs(used_leaves),
                    available_leaves: 0,
                    unpaid_leaves_of_curr_month: -unpaidleaves,
                    last_leave: moment(last_leave).format('D-MMM'),
                    year: moment(current_date).format('YYYY'),
                    current_date: moment(new Date()).format('DD-MMM-YYYY'),
                },
                success: true,
            })
        }
        return res.status(200).json({
            message: 'Leaves fetched Successfully',
            payload: {
                used_leaves: Math.abs(used_leaves),
                available_leaves: 18 + used_leaves,
                unpaid_leaves_of_curr_month: -unpaidleaves,
                last_leave:
                    last_leave.getDate() +
                    '-' +
                    Utils.monthNames[last_leave.getUTCMonth()],

                year: current_date.getUTCFullYear(),
                current_date:
                    new Date().getDate() +
                    '-' +
                    Utils.monthNames[new Date().getMonth()] +
                    '-' +
                    new Date().getFullYear(),
                late_arrivals: late_arrivals.length,
            },
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const getYearlyRecord = async (req, res) => {
    try {
        const leaves = await Leave.find({
            type: { $nin: ['monthly quota'] },
            employee_id: req.params.id,
            // eslint-disable-next-line no-dupe-keys
            type: req.body.type,
        }).populate('employee_id')

        let unpaidleaves = leaves
            .filter(
                (l) =>
                    l.status === 'rejected' &&
                    new Date(Utils.getFirstAndLastDayofMonth().first) <
                        new Date(l.date_end) &&
                    new Date(l.date_end) <
                        new Date(Utils.getFirstAndLastDayofMonth().last)
            )
            .reduce(function (pre, curr) {
                return pre + curr.no_of_days
            }, 0)
        const all_leaves = leaves.map((leave) => {
            return {
                month: Utils.monthNames[leave.date_start.getUTCMonth()],
                leave_date:
                    leave.date_start.getDate() +
                    '-' +
                    Utils.monthNames[leave.date_start.getUTCMonth()] +
                    '-' +
                    leave.date_start.getFullYear(),
                no_of_days: -leave.no_of_days,
                type: leave.type,
                unpaid_leaves: -unpaidleaves,
                status: leave.status,
                current_date:
                    new Date().getDate() +
                    '-' +
                    Utils.monthNames[new Date().getMonth()] +
                    '-' +
                    new Date().getFullYear(),
            }
        })

        return res.status(200).json({
            message: 'Leaves fetched Successfully',
            payload: all_leaves,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const getAllLeavesRecord = async (req, res) => {
    try {
        const leaves = await Leave.find({
            type: { $nin: ['monthly quota'] },
            employee_id: req.params.id,
        })
            .sort({ date_start: -1 })
            .populate('employee_id')

        let unpaidleaves = leaves
            .filter(
                (l) =>
                    l.status === 'rejected' &&
                    new Date(Utils.getFirstAndLastDayofMonth().first) <
                        new Date(l.date_end) &&
                    new Date(l.date_end) <
                        new Date(Utils.getFirstAndLastDayofMonth().last)
            )
            .reduce(function (pre, curr) {
                return pre + curr.no_of_days
            }, 0)

        const allMonths = [
            ...new Set(
                leaves.map(
                    (leave) => Utils.monthNames[leave.date_start.getUTCMonth()]
                )
            ),
        ]

        const finalLeaves = allMonths.map((monthItem) => {
            let finalResult = { month: monthItem, leaves: [] }
            leaves.map((leave) => {
                if (
                    Utils.monthNames[leave.date_start.getUTCMonth()] ===
                    monthItem
                ) {
                    finalResult.leaves.push({
                        leave_date:
                            leave.date_start.getDate() +
                            '-' +
                            Utils.monthNames[leave.date_start.getUTCMonth()] +
                            '-' +
                            leave.date_start.getFullYear(),
                        no_of_days: -leave.no_of_days,
                        type: leave.type,
                        unpaid_leaves: -unpaidleaves,
                        status: leave.status,
                        current_date:
                            new Date().getDate() +
                            '-' +
                            Utils.monthNames[new Date().getMonth()] +
                            '-' +
                            new Date().getFullYear(),
                    })
                }
            })
            return finalResult
        })

        return res.status(200).json({
            message: 'Leaves fetched Successfully',
            payload: finalLeaves,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

export default {
    createMonthlyQuota,
    createLeave,
    getLeaves,
    deleteLeave,
    updateLeave,
    balanceLeaves,
    deleteMonthlyQuota,
    balanceSingleEmployeeLeave,
    getEmployeeAllLeaves,
    deleteAllLeaves,
    getMonthlyRecord,
    getYearlyRecord,
    getAllLeavesRecord,
}
