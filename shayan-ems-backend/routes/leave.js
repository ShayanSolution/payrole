import express from 'express'
import Leave from '../controllers/leave.js'
import Protect from '../middlewares/authHandler.js'
const router = express.Router()

// Monthly Quota
router.post('/monthly-quota', Leave.createMonthlyQuota)
router.post('/delete-quota', Leave.deleteMonthlyQuota)

// Leaves Crud
router.post('/create-leave', Leave.createLeave)
router.post('/', Leave.getLeaves)
router.delete('/:leaveId', Leave.deleteLeave)
router.put('/:leaveId', Leave.updateLeave)
router.post('/employee', Leave.getEmployeeAllLeaves)
router.get('/all-leaves', Leave.deleteAllLeaves)
router.get('/record/:id', Leave.getMonthlyRecord)
router.post('/record-all/:id', Leave.getYearlyRecord)
router.get('/record-all/:id', Leave.getAllLeavesRecord)

// Balance Leave
router.post(
    '/balance-leaves',
    Protect.Protected,
    Protect.isAdmin,
    Leave.balanceLeaves
)
router.post(
    '/balance-single-leave',
    Protect.Protected,
    Protect.isAdmin,
    Leave.balanceSingleEmployeeLeave
)

export default router
