/* eslint-disable */
import Leave from '../models/leave.js'
import leaves from '../data/leave.json'
import { connectDB } from '../config/db.js'
require('dotenv').config()

connectDB()

const insertData = async () => {
    try {
        await Leave.deleteMany()
        await Leave.insertMany(leaves)
        console.log(`Data Imported`)
        process.exit()
    } catch (error) {
        console.log(`Error : ${error.message}`)
        process.exit(1)
    }
}

insertData()
