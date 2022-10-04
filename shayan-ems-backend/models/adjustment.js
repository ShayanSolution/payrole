import mongoose from 'mongoose'

const adjustmentSchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    valid_from: {
        type: Date,
        required: true,
    },
    valid_to: {
        type: Date,
        required: true,
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees',
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
})

var adjustments = mongoose.model('adjustments', adjustmentSchema)
export default adjustments
