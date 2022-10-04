/* eslint-disable */
import Payroll from '../models/payroll.js'
import payroll from '../data/payrolls.json'
import { connectDB } from '../config/db.js'
require('dotenv').config()

connectDB()

const insertData = async () => {
    try {
        await Payroll.deleteMany()
        await Payroll.insertMany(payroll)
        console.log(`Data Imported`)
        process.exit()
    } catch (error) {
        console.log(`Error : ${error.message}`)
        process.exit(1)
    }
}

insertData()
