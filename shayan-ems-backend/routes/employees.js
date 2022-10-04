import express from 'express'
import Employee from '../controllers/employees.js'
import Protect from '../middlewares/authHandler.js'
const router = express.Router()

router.get('/', Employee.getEmployees)
router.get(
    '/get-employee/:employeeId',
    Protect.Protected,
    Employee.getEmployeeById
)
router.post('/create-employee', Protect.Protected, Employee.createEmployee)
router.put('/update-employee', Protect.Protected, Employee.updateEmployee)
router.delete(
    '/delete-employee/:employeeId',
    Protect.Protected,
    Employee.deleteEmployee
)
router.post('/login', Employee.getEmployee)

export default router
