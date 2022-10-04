import express from 'express'
import Adjustment from '../controllers/adjustment.js'

const router = express.Router()

router.post('/', Adjustment.createAdjustment)
router.get('/:employee_id', Adjustment.getAdjustments)
router.put('/edit', Adjustment.updateAdjustment)
router.delete('/:id', Adjustment.deleteAdjustments)

export default router
