import Contract from '../models/contract.js'
import Employee from '../models/employees.js'

const getContracts = async (req, res) => {
    try {
        const contracts = await Contract.find()

        res.status(200).json({
            message: 'Contracts fetched Successfully',
            payload: contracts,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const getContract = async (req, res) => {
    const { contractId } = req.params

    try {
        const contract = await Contract.findOne({ _id: contractId })
        if (!contract) {
            return res
                .status(200)
                .json({ message: 'No contract found', success: false })
        }
        res.status(200).json({
            message: 'Contract fetched successfully',
            payload: contract,
            success: true,
        })
    } catch (error) {
        res.status(200).json({ message: error.message, success: false })
    }
}

const createContract = async (payload) => {
    const { status, joining_date } = payload
    const ended_at =
        status === 'Permanent'
            ? new Date(
                  new Date(joining_date).setMonth(
                      new Date(joining_date).getMonth() + 12
                  )
              )
            : new Date(
                  new Date(joining_date).setMonth(
                      new Date(joining_date).getMonth() + 3
                  )
              )

    const newContract = new Contract({
        contract: status,
        created_at: new Date(),
        started_at: new Date(joining_date),
        ended_at: ended_at,
    })
    const response = await newContract.save()
    return response._id
}

const updateContract = async (req, res) => {
    const { _id, started_at } = req.body
    try {
        const contractInDb = await Contract.findById(_id)
        if (!contractInDb) {
            return res
                .status(200)
                .json({ message: 'No contract found', success: false })
        }

        const contract = req.body.contract ?? contractInDb.contract

        const current_date = started_at ? new Date(started_at) : new Date()
        const ended_at = req.body.ended_at
            ? req.body.ended_at
            : contract === 'Permanent'
            ? new Date(
                  new Date(current_date).setMonth(
                      new Date(current_date).getMonth() + 12
                  )
              )
            : new Date(
                  new Date(current_date).setMonth(
                      new Date(current_date).getMonth() + 3
                  )
              )
        const updatedContract = {
            employee_id: req.body.employeeId,
            created_at: new Date(),
            updated_at: new Date(),
            started_at: started_at
                ? new Date(started_at)
                : new Date(contractInDb.started_at),
            ended_at: ended_at ? new Date(ended_at) : ended_at,
            contract,
        }
        const response = await Contract.findOneAndUpdate(
            {
                _id: _id,
            },
            updatedContract,
            { new: true }
        )
        await updateEmployeeContractStatus(response)
        res.status(202).json({
            message: 'Contract updated successfully',
            payload: response,
            success: true,
        })
    } catch (error) {
        res.status(401).json({ message: error.message, success: false })
    }
}

const updateEmployeeContractStatus = async (payload) => {
    const { employee_id, contract, _id } = payload
    return await Employee.findOneAndUpdate(
        {
            _id: employee_id,
        },
        {
            updated_at: new Date(),
            contract: contract,
            contract_id: _id,
        }
    )
}

export default {
    createContract,
    updateContract,
    getContract,
    getContracts,
}
