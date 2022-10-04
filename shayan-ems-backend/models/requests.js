import mongoose from 'mongoose'
const requestSchema = mongoose.Schema(
    {
        employee_id: {
            type: String,
        },
        first_name: {
            type: String,
        },
        last_name: {
            type: String,
        },
        request_title: {
            type: String,
        },
        request_purpose: {
            type: String,
        },
        request_status: {
            type: String,
        },
        request_desc: {
            type: String,
        },
        request_date: {
            type: String,
        },
        isSoftDeleted: {
            type: Boolean,
        },
    },
    {
        timestamps: true,
    }
)

var request = mongoose.model('request', requestSchema)
export default request
