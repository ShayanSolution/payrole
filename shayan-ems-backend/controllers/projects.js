import Project from '../models/projects.js'

const getProjects = async (req, res) => {
    try {
        /* eslint-disable */
        console.log(Project)
        const projects = [
            {
                project_title: 'Tutor Teacher',
                project_logo:
                    'https://i.ibb.co/zbZQ6d4/2022-06-28-15-46-26.png',
                project_desc:
                    'Tutor Teacher is the "easiest" way to find students online through our app. If you are a looking for job opportunity as tutors with experience , Download TOOTAR App now on Playstore/Appstore.',
            },
            {
                project_title: 'Tootar',
                project_logo:
                    'https://i.ibb.co/zbZQ6d4/2022-06-28-15-46-26.png',
                project_desc:
                    'Tootar is the "easiest" way to find tutor/instructor. If you are a parent or a student , looking for job opportunity as tutors with experience , Download TOOTAR App now on Playstore/Appstore.',
            },
        ]
        res.status(200).json({
            message: 'Project fetched Successfully',
            payload: projects,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

export default {
    getProjects,
}
