import Course from '../models/courses.js'

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find()
        res.status(200).json({
            message: 'Course fetched Successfully',
            payload: courses,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const createCourse = async (req, res) => {
    const isCourseExist = await Course.findOne({
        courses_title: req.body.courses_title,
    })
    if (isCourseExist) {
        return res.status(200).json({
            message: 'Course with given title already exists',
            success: false,
        })
    }

    const course = {
        courses_title: req.body.courses_title,
        course_link: req.body.course_link,
        course_desc: req.body.course_desc,
        course_status: req.body.course_status,
    }
    let newCourse = new Course(course)
    try {
        await newCourse.save()
        res.status(200).json({
            message: 'Course saved successfully',
            payload: newCourse,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const deleteCourse = async (req, res) => {
    const { courseId } = req.params
    try {
        await Course.findByIdAndDelete({
            _id: courseId,
        })
        return res.status(200).json({
            message: 'Course deleted successfully',
            success: true,
            payload: courseId,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const updateCourse = async (req, res) => {
    const { courseId } = req.params
    try {
        const courseInDb = await Course.findById(courseId)
        if (!courseInDb) {
            return res.status(200).json({
                message: 'No Course found against this id',
                success: false,
            })
        }
        const updated = await Course.findOneAndUpdate(
            {
                _id: courseId,
            },
            { $set: req.body },
            { new: true }
        )
        return res.status(200).json({
            message: 'Course updated successfully',
            payload: updated,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

export default {
    getCourses,
    createCourse,
    deleteCourse,
    updateCourse,
}
