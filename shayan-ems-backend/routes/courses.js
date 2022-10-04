import express from 'express'
import Course from '../controllers/courses.js'
const router = express.Router()

// Courses Crud
router.get('/', Course.getCourses)
router.post('/create-course', Course.createCourse)
router.delete('/:courseId', Course.deleteCourse)
router.put('/:courseId', Course.updateCourse)

export default router
