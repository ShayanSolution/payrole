import mongoose from 'mongoose'
const projectsSchema = mongoose.Schema(
    {
        project_title: {
            type: String,
        },
        project_logo: {
            type: String,
        },
        project_desc: {
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

var projects = mongoose.model('projects', projectsSchema)
export default projects
