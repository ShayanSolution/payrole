import express from 'express'
import Attendance from '../controllers/attendance.js'
const router = express.Router()

router.post('/add-attendance-by-month', Attendance.addAllAttendances)
router.delete('/delete-all', Attendance.deleteAttendance)
router.post('/get-attendance-by-month', Attendance.getAttendanceByMonth)
router.post('/late-arrivals/:id', Attendance.getLateArrivalByMonth)
router.put('/', Attendance.updateAttendance)

export default router
