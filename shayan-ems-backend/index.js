import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { connectDB } from './config/db.js'
process.env.TZ = 'UTC'
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: '*',
    },
})
global.io = io
app.use(cors())
app.use(express.json())
dotenv.config()
const port = process.env.PORT || 5000

connectDB()

app.get('/', (req, res) => res.send('Nodejs api connected3 successfully!!!'))
import employeesRouter from './routes/employees.js'
import contractRouter from './routes/contracts.js'
import payrollRouter from './routes/payroll.js'
import leaveRouter from './routes/leave.js'
import emailRouter from './routes/email.js'
import attendanceRouter from './routes/attendance.js'
import eventRouter from './routes/event.js'
import requestRouter from './routes/requests.js'
import suggestionRouter from './routes/suggestion.js'
import shiftRouter from './routes/shift.js'
import courseRouter from './routes/courses.js'
import projectRouter from './routes/projects.js'
import adjustmentRouter from './routes/adjustment.js'
app.use('/employees', employeesRouter)
app.use('/contracts', contractRouter)
app.use('/payrolls', payrollRouter)
app.use('/leave', leaveRouter)
app.use('/email', emailRouter)
app.use('/attendance', attendanceRouter)
app.use('/event', eventRouter)
app.use('/requests', requestRouter)
app.use('/suggestion', suggestionRouter)
app.use('/shift', shiftRouter)
app.use('/courses', courseRouter)
app.use('/projects', projectRouter)
app.use('/adjustment', adjustmentRouter)
httpServer.listen(port, () => {
    /* eslint-disable */
    console.log('Server started at: ', port)
})
