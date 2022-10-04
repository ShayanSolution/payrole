import mongoose from 'mongoose'

const attendanceSchema = mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    clock_In: {
        type: String,
    },
    clock_Out: {
        type: String,
    },
    late: {
        type: String,
    },
    absent: {
        type: String,
    },
    week: {
        type: String,
    },
    sum_over_time: {
        type: String,
    },
    machine_no: {
        type: Number,
    },
    status: {
        type: String,
    },
    exempt: {
        type: Boolean,
    },
    reason: {
        type: String,
    },
})

var attendance = mongoose.model('Attendance', attendanceSchema)
export default attendance
