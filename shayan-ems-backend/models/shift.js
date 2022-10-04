import mongoose from 'mongoose'

const shiftSchema = mongoose.Schema(
    {
        shift_name: {
            type: String,
            required: true,
        },
        employee_shift: {
            type: String,
        },
        working_hours: {
            type: String,
            required: true,
        },
        start_time: {
            type: String,
        },
        end_time: {
            type: String,
        },
        no_of_hours: {
            type: Number,
            required: true,
        },
        working_days: {
            type: Array,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

var shift = mongoose.model('shift', shiftSchema)
export default shift
