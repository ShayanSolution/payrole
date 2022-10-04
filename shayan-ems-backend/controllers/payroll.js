import Constants from '../Constants.js'
import Attendance from '../models/attendance.js'
import Leave from '../models/leave.js'
import Payroll from '../models/payroll.js'
import Contract from '../models/contract.js'
import moment from 'moment'
import Utils from '../utils/utils.js'
import Adjustment from '../models/adjustment.js'

const getPayrolls = async (req, res) => {
    try {
        const date = new Date(req.body.month)
        const payrolls = await Payroll.find({ salary_date: date }).populate(
            'employee_id adjustments'
        )
        const filteredEmployees = payrolls.filter(
            (payroll) => payroll.employee_id?.isSoftDeleted === false
        )
        res.status(200).json({
            message: 'Payrolls fetched Successfully',
            payload: filteredEmployees,
            success: true,
        })
    } catch (error) {
        res.status(200).json({
            message: error.message,
            payload: [],
            success: false,
        })
    }
}

const getPayrollByid = async (req, res) => {
    try {
        const salary = await Payroll.find({
            employee_id: req.params.id,
        }).populate('employee_id adjustments')
        const all_salaries = salary.map((salary) => {
            return {
                bonus: salary.bonus,
                deduction: salary.deductions,
                base_salary: salary.total_salary,
                final_salary: salary.final_salary,
                bonus_note: salary.bonus_note,
                deduction_note: salary.deduction_note,
                month: Utils.monthFullNames[salary.salary_date.getMonth()],
                tax: salary.tax,
                medical_allowance: salary.employee_id.medical_allowance,
            }
        })

        res.status(200).json({
            message: 'Payrolls fetched Successfully',
            current_salary: all_salaries[0].base_salary,
            payload: all_salaries,
            success: true,
        })
    } catch (error) {
        res.status(200).json({
            message: error.message,
            payload: [],
            success: false,
        })
    }
}

const createPayroll = async (req, res) => {
    const {
        salary,
        advance_deduction,
        contract,
        no_of_hours,
        incentive,
        salary_date,
        joining_date,
        medical_allowance,
        yearly_quota: quota,
    } = req.body

    try {
        let yearly_quota = quota ? quota : 0
        const adjustments = await Adjustment.find({
            employee: req.body.employee_id,
            valid_from: { $lte: req.body.salary_date },
            valid_to: { $gte: req.body.salary_date },
        })
        const change = adjustments.reduce((acc, each) => acc + each.value, 0)
        let total_deduction
        let late_arrivals_deduction = 0
        let leave_deductions = 0
        let no_of_late = 0
        let numeric_salary = Number(salary.replace(/[^0-9.]/g, ''))
        let tax = 0
        let taxable = false

        if (contract === 'Hourly') {
            numeric_salary *= parseInt(no_of_hours)
        }
        let final_salary = numeric_salary + medical_allowance + change
        if (contract === 'Permanent') {
            const contracts = await Contract.find({
                employee_id: req.body.employee_id,
            })
            if (contracts.length > 0) {
                if (
                    moment(contracts[0].created_at).format('YYYY-MM') ===
                    moment(req.body.salary_date).format('YYYY-MM')
                ) {
                    taxable = true
                }
            }
            tax = Utils.calculateTax(numeric_salary)
        }

        if (taxable === true) {
            const Prev_salary = await Payroll.find({
                employee_id: req.body.employee_id,
            })
            const salary_data = Prev_salary.map((salary) => {
                return {
                    salary_date: salary.salary_date,
                    total_salary: salary.total_salary,
                }
            })

            const three_months_salary = salary_data.slice(-3)
            tax = three_months_salary
                .map((item) => Utils.calculateTax(item.total_salary))
                .reduce((prev, curr) => prev + curr, 0)
        }

        const getEmployeePayroll = await Payroll.find({
            employee_id: req.body.employee_id,
        })

        const month = new Date(salary_date).getMonth() + 1
        const year = new Date(salary_date).getFullYear()
        for (let getPayroll of getEmployeePayroll) {
            if (
                month === getPayroll.salary_date.getMonth() + 1 &&
                year === getPayroll.salary_date.getFullYear()
            ) {
                return res.status(200).json({
                    message: `Payslip already exist for ${req.body.employee_name}`,
                    success: false,
                })
            }
        }

        const first_day = Utils.getFirstAndLastDayofMonth(salary_date).first
        const last_day = Utils.getFirstAndLastDayofMonth(salary_date).last

        const attendance = await Attendance.find({
            employee_id: req.body.employee_id,
            date: { $gte: first_day, $lte: last_day },
        })
        const exemptions = attendance.filter((att) => att.exempt).length
        const late_arrivals = attendance.filter(
            (att) => att.status === 'Late'
        ).length
        const allLeaves = await Leave.find({
            employee_id: req.body.employee_id,
            status: { $ne: 'exempted' },
            type: { $ne: 'monthly quota' },
            date_end: { $lte: last_day },
        })

        let leaves = allLeaves.filter(
            (leave) => new Date(leave.date_end).getMonth() + 1 === month
        )

        const allExtraLeaves = allLeaves
            .filter(
                (l) =>
                    l.status !== 'rejected' &&
                    l.type !== 'Balance' &&
                    new Date(l.date_end).getMonth() + 1 < month
            )
            .reduce(function (pre, curr) {
                return pre + curr.no_of_days
            }, 0)

        let extra_leaves = leaves
            .filter((l) => l.status !== 'rejected' && l.type !== 'Balance')
            .reduce(function (pre, curr) {
                return pre + curr.no_of_days
            }, 0)
        let unpaidleaves = leaves
            .filter((l) => l.status === 'rejected')
            .reduce(function (pre, curr) {
                return pre + curr.no_of_days
            }, 0)

        let finalLeaves = unpaidleaves

        let remainingLeaves = yearly_quota - Math.abs(allExtraLeaves)

        if (extra_leaves < 0) {
            if (remainingLeaves > 0) {
                remainingLeaves += extra_leaves
                finalLeaves =
                    remainingLeaves < 0
                        ? finalLeaves + remainingLeaves
                        : finalLeaves
            } else if (remainingLeaves <= 0) {
                finalLeaves += extra_leaves
                remainingLeaves = extra_leaves + unpaidleaves
            }
        } else if (unpaidleaves < 0 && remainingLeaves <= 0) {
            remainingLeaves = unpaidleaves
        } else if (remainingLeaves < 0) {
            remainingLeaves = 0
        }

        leave_deductions =
            Utils.perDayLeaveDeduction(final_salary) * Math.abs(finalLeaves)
        if (exemptions > Constants.EXEMPTION_PER_MONTH) {
            no_of_late = parseInt(late_arrivals) - exemptions + no_of_late
            late_arrivals_deduction = no_of_late * Constants.PER_LATE_ARRIVAL
        } else {
            if (parseInt(late_arrivals) > exemptions) {
                late_arrivals_deduction =
                    (late_arrivals - exemptions) * Constants.PER_LATE_ARRIVAL
                no_of_late = late_arrivals
            } else {
                late_arrivals_deduction = 0
            }
        }

        const leave_comment = `\n${Math.abs(
            finalLeaves
        )} Leaves deducted @ Rs ${Utils.perDayLeaveDeduction(
            final_salary
        )} per day`
        const late_arrivals_comment = `\n${
            no_of_late - exemptions
        } Late arrivals deducted @ Rs ${
            Constants.PER_LATE_ARRIVAL
        } per late arrival`
        const advance_deduction_comment = `\n Advance deduction is @ Rs ${advance_deduction}`
        const incentive_comment = `\n incentive added is @ Rs ${incentive}`
        const hours_comment = `\n Salary calculated @ ${no_of_hours} hours`

        // Added every notes should be there if something new is added it should be there
        const notes = `${req.body.bonus_note} ${
            leave_deductions > 0 ? leave_comment : ''
        } ${late_arrivals_deduction > 0 ? late_arrivals_comment : ''} ${
            advance_deduction > 0 ? advance_deduction_comment : ''
        } ${parseInt(incentive) > 0 ? incentive_comment : ''} ${
            contract === 'Hourly' ? hours_comment : ''
        }`

        const joinedMonth = new Date(joining_date).getMonth() + 1
        const joinedYear = new Date(joining_date).getFullYear()
        const joinedDate = new Date(joining_date).getDate() - 1
        if (joinedYear === year && joinedMonth === month) {
            final_salary = Math.round((final_salary / 30) * (30 - joinedDate))
        }

        if (Number(final_salary) < total_deduction) {
            return res.status(200).json({
                message: 'Deductions are more than salary',
                success: false,
            })
        }

        if (process.env.MANUAL_TAX_DEDUCTION !== 'FALSE') tax = 0
        total_deduction =
            leave_deductions +
            late_arrivals_deduction +
            parseInt(advance_deduction)

        final_salary -= total_deduction.toFixed()

        const payroll = {
            employee_name: req.body.employee_name,
            employee_id: req.body.employee_id,
            job_title: req.body.job_title,
            bonus: incentive,
            total_salary: numeric_salary,
            deductions: total_deduction,
            late_arrivals: late_arrivals,
            final_salary: final_salary,
            salary_date: new Date(salary_date),
            created_at: new Date(),
            notes: notes,
            exemptions,
            remaining_leaves: remainingLeaves,
            availed_leaves: -(unpaidleaves + extra_leaves),
            used_leaves: allExtraLeaves,
            contract,
            tax,
            adjustments: adjustments.map((adjustment) => adjustment._id),
            advance_deduction: Number(advance_deduction),
        }
        const newPayroll = new Payroll(payroll)

        await newPayroll.save()
        res.status(200).json({
            message: 'Payroll created successfully',
            payload: payroll,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const deletePayroll = async (req, res) => {
    const { payrollId } = req.params
    try {
        await Payroll.findByIdAndDelete(
            {
                _id: payrollId,
            },
            {
                isSoftDeleted: true,
                deleted_at: new Date(),
                updated_at: new Date(),
            }
        )
        res.status(200).json({
            message: 'Payroll deleted successfully',
            success: true,
            payload: payrollId,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: true })
    }
}

const updatePayroll = async (req, res) => {
    const { payrollId } = req.params

    try {
        const updatedPayroll = await Payroll.findOneAndUpdate(
            { _id: payrollId },
            req.body,
            { new: true }
        )

        res.status(200).json({
            message: 'Payroll updated successfully',
            success: true,
            payload: updatedPayroll,
        })
    } catch (error) {
        res.status(400).json({ message: error.message, success: false })
    }
}

export default {
    createPayroll,
    getPayrolls,
    getPayrollByid,
    deletePayroll,
    updatePayroll,
}
