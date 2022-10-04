import mongoose from 'mongoose'

const contractSchema = mongoose.Schema({
    employee_id: {
        type: String,
    },
    contract: {
        type: Object,
        required: true,
    },
    started_at: {
        type: Date,
    },
    ended_at: {
        type: Date,
    },
    created_at: {
        type: Date,
        required: true,
    },
    updated_at: {
        type: Date,
    },
    deleted_at: {
        type: Date,
    },
})

var contracts = mongoose.model('contracts', contractSchema)
export default contracts
