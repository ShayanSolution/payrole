import express from 'express'
import Payroll from '../controllers/payroll.js'
import Protect from '../middlewares/authHandler.js'
const router = express.Router()

router.post('/', Protect.Protected, Payroll.getPayrolls)
router.get('/salary/:id', Payroll.getPayrollByid)
router.post('/create-payroll', Protect.Protected, Payroll.createPayroll)
router.delete(
    '/delete-payroll/:payrollId',
    Protect.Protected,
    Payroll.deletePayroll
)
router.put(
    '/update-payroll/:payrollId',
    Protect.Protected,
    Payroll.updatePayroll
)
export default router
