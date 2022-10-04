import mongoose from 'mongoose'
const coursesSchema = mongoose.Schema(
    {
        courses_title: {
            type: String,
        },
        course_link: {
            type: String,
        },
        course_desc: {
            type: String,
        },
        course_status: {
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

var courses = mongoose.model('courses', coursesSchema)
export default courses
