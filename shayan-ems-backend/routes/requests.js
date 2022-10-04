import express from 'express'
import Requests from '../controllers/requests.js'
const router = express.Router()

// Requests Crud
router.post('/', Requests.getallRequestes)
router.get('/:id', Requests.getRequests)
router.post('/create-request/:id', Requests.createRequests)
router.delete('/:requestId', Requests.deleteRequest)
router.put('/:requestId', Requests.updateRequest)
export default router
