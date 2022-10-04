import mongoose from 'mongoose'

const employeeContractSchema = mongoose.Schema(
    {
        employee_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'employees',
            required: true,
        },
        contract_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'contracts',
            required: true,
        },
    },
    {
        timeStamps: true,
    }
)

var empContracts = mongoose.model('empContracts', employeeContractSchema)
export default empContracts
