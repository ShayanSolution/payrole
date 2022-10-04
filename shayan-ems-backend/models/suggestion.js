import mongoose from 'mongoose'
const suggestionSchema = mongoose.Schema(
    {
        employee_id: {
            type: String,
        },
        employee_name: {
            type: String,
        },
        suggestion_message: {
            type: String,
        },
        suggestion_status: {
            type: String,
        },
        suggestion_date: {
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

var suggestion = mongoose.model('suggestion', suggestionSchema)
export default suggestion
