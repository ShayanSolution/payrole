import mongoose from 'mongoose'

const leaveSchema = mongoose.Schema(
    {
        employee_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'employees',
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        approved_at: {
            type: Date,
        },
        approved_by: {
            type: String,
        },
        no_of_days: {
            type: Number,
            required: true,
        },
        date_start: {
            type: Date,
            required: true,
        },
        date_end: {
            type: Date,
            required: true,
        },
        date_join: {
            type: Date,
            required: true,
        },
        reason: {
            type: String,
        },
        isSoftDeleted: {
            type: Boolean,
        },
        exempt_reason: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

var leave = mongoose.model('leave', leaveSchema)
export default leave
