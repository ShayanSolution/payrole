import express from 'express'
import Email from '../controllers/sendEmail.js'
const router = express.Router()

router.post('/email', Email.sendEmail)

export default router
