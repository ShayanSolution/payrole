import mongoose from 'mongoose'
const eventSchema = mongoose.Schema(
    {
        event: {
            type: String,
        },
        event_name: {
            type: String,
        },
        Day: {
            type: String,
        },
        Date: {
            type: String,
        },
        event_date: {
            type: Date,
        },
        isSoftDeleted: {
            type: Boolean,
        },
    },
    {
        timestamps: true,
    }
)

var event = mongoose.model('event', eventSchema)
export default event
