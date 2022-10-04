/* eslint-disable */
import Employee from '../models/employees.js'
import employees from '../data/employees.json'
import { createContract } from '../controllers/contract.js'
require('dotenv').config()
import { connectDB } from '../config/db'
import Contracts from '../models/contract.js'
import EmpContracts from '../models/emp_contract.js'

connectDB()

const insertData = async () => {
    await Employee.deleteMany()
    await Contracts.deleteMany()

    await Promise.all(
        employees[0].document.map(async (element) => {
            const isEmployeeExistAgainstCnic = await Employee.findOne({
                national_id_number: element.national_id_number,
            })

            const isEmployeeExistAgainstEmail = await Employee.findOne({
                personal_email: element.email,
            })

            if (isEmployeeExistAgainstEmail) {
                return console.log({
                    message: 'Employee with given email already exists',
                    success: false,
                })
            }

            if (isEmployeeExistAgainstCnic) {
                return console.log({
                    message: 'Employee with given Cnic already exists',
                    success: false,
                })
            }

            const newContract = await createContract(element)
            const employee = {
                _id: element._id,
                first_name: element.first_name,
                last_name: element.last_name,
                father_name: element.father_name,
                personal_email: element.personal_email,
                official_email: element.official_email,
                mobile_number: element.mobile_number,
                residential_number: element.residential_number,
                national_id_number: element.national_id_number,
                date_of_birth: element.date_of_birth,
                residential_address: element.residential_address,
                permanent_address: element.permanent_address,
                joining_date: new Date(element.joining_date),
                salary: element.salary,
                contract: element.status,
                job_title: element.job_title,
                contract_id: newContract._id,
                machine_no: element.machine_no ? element.machine_no : null,
                created_at: new Date(),
                isSoftDeleted: false,
            }
            if (element.password) {
                ;(employee.password = element.password),
                    (employee.role = element.role)
            }
            const newEmployee = new Employee(employee)
            try {
                const emp = await newEmployee.save()
                await EmpContracts.create({
                    employee_id: emp._id,
                    contract_id: newContract._id,
                })
                console.log(`Data Imported`)
                return 1
            } catch (error) {
                console.log({ message: error.message, success: false })
                process.exit(1)
            }
        })
    )
    process.exit()
}

insertData()
