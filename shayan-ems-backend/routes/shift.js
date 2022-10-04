import express from 'express'
import Shift from '../controllers/shift.js'
const router = express.Router()

// Shift Crud
router.get('/', Shift.getShift)
router.post('/create-shift', Shift.createShift)
router.delete('/:shiftId', Shift.deleteShift)
router.put('/:shiftId', Shift.updateShift)

export default router
