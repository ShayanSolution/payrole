import express from 'express'
import Contract from '../controllers/contract.js'
const router = express.Router()

router.get('/', Contract.getContracts)
router.get('/get-contract/:contractId', Contract.getContract)
router.put('/update-contract', Contract.updateContract)

export default router
