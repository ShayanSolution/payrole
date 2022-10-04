import mongoose from 'mongoose'

const payrollSchema = mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees',
        required: true,
    },
    employee_name: {
        type: String,
        required: true,
    },
    job_title: {
        type: String,
        required: true,
    },
    total_salary: {
        type: Number,
        required: true,
    },
    deductions: {
        type: Number,
        required: true,
    },
    salary_date: {
        type: Date,
        required: true,
    },
    final_salary: {
        type: Number,
        required: true,
    },
    bonus: {
        type: Number,
    },
    created_at: {
        type: Date,
        required: true,
    },
    late_arrivals: {
        type: Number,
        required: true,
    },
    exemptions: {
        type: Number,
        required: true,
    },
    availed_leaves: {
        type: Number,
        required: true,
    },
    remaining_leaves: {
        type: Number,
        required: true,
    },
    used_leaves: {
        type: Number,
    },
    notes: {
        type: String,
    },
    contract: {
        type: String,
    },
    tax: {
        type: Number,
    },
    advance_deduction: {
        type: Number,
    },
    adjustments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'adjustments' }],
})

var payroll = mongoose.model('payroll', payrollSchema)
export default payroll
