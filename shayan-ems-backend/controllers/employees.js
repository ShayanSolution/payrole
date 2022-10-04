import Employee from '../models/employees.js'
import Contracts from './contract.js'
import Contract from '../models/contract.js'
import bcrypt from 'bcryptjs'

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate('contract_id')

        res.status(200).json({
            message: 'Employees fetched Successfully',
            payload: employees,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const getEmployeeById = async (req, res) => {
    const { employeeId } = req.params

    try {
        const contracts = await Contract.find({ employee_id: employeeId })
        if (contracts.length > 0) {
            const data = contracts.slice(-1).pop()
            const updatedEmployee = {
                contract_id: data._id,
            }
            await Employee.findOneAndUpdate(
                {
                    _id: employeeId,
                },
                updatedEmployee
            )
        }
        const employee = await Employee.findOne({ _id: employeeId })
            .populate('contract_id')
            .exec()
        if (!employee) {
            return res.status(200).json({
                message: 'No employee found against this id',
                success: false,
            })
        }
        res.status(200).json({
            message: 'Employee fetched successfully',
            payload: employee,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const getEmployee = async (req, res) => {
    try {
        let { email, password } = req.body

        let user = await Employee.findOne({
            official_email: email,
            role: { $in: ['Admin', 'HR'] },
        })
        if (!user) {
            res.status(200)
            return res.json({
                message: 'User not found',
                success: false,
            })
        }

        if (!(await user.matchPassword(password))) {
            res.status(200)
            return res.json({
                message: 'Email or password is incorrect',
                success: false,
            })
        }
        res.json({
            message: 'User Created Sucessfully',
            success: true,
            payload: {
                _id: user._id,
                name: `${user.first_name} ${user.last_name}`,
                email: user.official_email,
                role: user.role,
                token: user.generateToken(),
            },
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const createEmployee = async (req, res) => {
    const isEmployeeExistAgainstCnic = await Employee.findOne({
        national_id_number: req.body.national_id_number,
    })

    const isEmployeeExistAgainstEmail = await Employee.findOne({
        personal_email: req.body.email,
    })

    if (isEmployeeExistAgainstEmail) {
        return res.status(200).json({
            message: 'Employee with given email already exists',
            success: false,
        })
    }

    if (isEmployeeExistAgainstCnic) {
        return res.status(200).json({
            message: 'Employee with given Cnic already exists',
            success: false,
        })
    }
    const newContract = await Contracts.createContract(req.body)
    const {
        first_name,
        last_name,
        father_name,
        personal_email,
        official_email,
        mobile_number,
        residential_number,
        national_id_number,
        date_of_birth,
        residential_address,
        permanent_address,
        joining_date,
        role,
        salary,
        medical_allowance,
        status,
        job_title,
        machine_no,
        password,
        account_No,
    } = req.body
    const employee = {
        first_name,
        last_name,
        father_name,
        personal_email,
        official_email,
        mobile_number,
        residential_number,
        national_id_number,
        date_of_birth,
        residential_address,
        permanent_address,
        joining_date: new Date(joining_date),
        role,
        salary,
        medical_allowance,
        contract: status,
        job_title,
        machine_no: machine_no ? machine_no : null,
        contract_id: newContract._id,
        password,
        account_No,
        created_at: new Date(),
        isSoftDeleted: false,
    }

    const newEmployee = new Employee(employee)
    try {
        await newEmployee.save()

        res.status(200).json({
            message: 'Employee saved successfully',
            payload: newEmployee,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const updateEmployee = async (req, res) => {
    const { _id, yearly_quota } = req.body
    try {
        const employeeInDb = await Employee.findById(_id)
        if (!employeeInDb) {
            return res.status(200).json({
                message: 'No employee found against this id',
                success: false,
            })
        }

        const updatedEmployee = {
            _id: req.body._id,
            first_name: req.body.first_name || employeeInDb.first_name,
            last_name: req.body.last_name || employeeInDb.last_name,
            father_name: req.body.father_name || employeeInDb.father_name,
            personal_email:
                req.body.personal_email || employeeInDb.personal_email,
            official_email:
                req.body.official_email || employeeInDb.official_email,
            mobile_number: req.body.mobile_number || employeeInDb.mobile_number,
            residential_number:
                req.body.residential_number || employeeInDb.residential_number,
            national_id_number:
                req.body.national_id_number || employeeInDb.national_id_number,
            date_of_birth: req.body.date_of_birth || employeeInDb.date_of_birth,
            residential_address:
                req.body.residential_address ||
                employeeInDb.residential_address,
            permanent_address:
                req.body.permanent_address || employeeInDb.permanent_address,
            joining_date: req.body.joining_date || employeeInDb.joining_date,
            salary: req.body.salary || employeeInDb.salary,
            account_No: req.body.account_No || employeeInDb.account_No,

            job_title: req.body.job_title || employeeInDb.job_title,
            isSoftDeleted: employeeInDb.isSoftDeleted,
            updated_at: new Date(),
            created_at: employeeInDb.created_at,
            contract_id: employeeInDb.contract_id,
            machine_no: req.body.machine_no || employeeInDb.machine_no,
            medical_allowance:
                req.body.medical_allowance || employeeInDb.medical_allowance,
        }
        if (req.body.password) {
            let salt = await bcrypt.genSalt(10)
            let password = await bcrypt.hash(req.body.password, salt)
            updatedEmployee.password = password
        }
        if (yearly_quota !== undefined || yearly_quota !== null)
            updatedEmployee.yearly_quota = yearly_quota
        if (req.body.role) {
            updatedEmployee.role = req.body.role
        }
        await Employee.findOneAndUpdate(
            {
                _id: _id,
            },
            updatedEmployee
        )
        res.status(200).json({
            message: 'Employee updated successfully',
            payload: updatedEmployee,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const deleteEmployee = async (req, res) => {
    const { employeeId } = req.params
    try {
        await Employee.findOneAndUpdate(
            {
                _id: employeeId,
            },
            {
                isSoftDeleted: true,
                deleted_at: new Date(),
                updated_at: new Date(),
            }
        )
        res.status(200).json({
            message: 'Employee deleted successfully',
            success: true,
            payload: employeeId,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: true })
    }
}

export default {
    getEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    getEmployee,
}
