import Adjustment from '../models/adjustment.js'
const createAdjustment = async (req, res) => {
    const { type, value, valid_from, valid_to, employee_id, label } =
        req.body.payload
    try {
        const adjustment = new Adjustment({
            type,
            value,
            valid_from,
            valid_to,
            label,
            employee: employee_id,
        })
        const result = await adjustment.save()
        return res.status(201).json({
            message: 'Adjustment added Succesfully',
            data: result,
            success: true,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}
const updateAdjustment = async (req, res) => {
    const { type, value, valid_from, valid_to, adjustment_id, label } =
        req.body.payload
    try {
        const result = await Adjustment.findOneAndUpdate(
            { _id: adjustment_id },
            { type, value, valid_from, valid_to, label },
            { returnOriginal: false }
        )
        return res.status(201).json({
            message: 'Adjustment edited Succesfully',
            data: result,
            success: true,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}
const getAdjustments = async (req, res) => {
    const { employee_id } = req.params
    try {
        const adjustments = await Adjustment.find({ employee: employee_id })
        return res.status(200).json({
            data: adjustments,
            success: true,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}

const deleteAdjustments = async (req, res) => {
    const { id } = req.params
    try {
        const adjustments = await Adjustment.findByIdAndDelete({
            _id: id,
        })
        return res.status(200).json({
            data: adjustments,
            message: 'Adjustment has been deleted successfully',
            success: true,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}

export default {
    getAdjustments,
    createAdjustment,
    updateAdjustment,
    deleteAdjustments,
}
