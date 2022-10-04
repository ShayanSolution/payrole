import Employee from '../models/employees.js'
import jwt from 'jsonwebtoken'

const Protected = async (req, res, next) => {
    let token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]
            let { id } = jwt.decode(token, process.env.JWT_SECRET)
            let user = await Employee.findById(id).select('-password')
            req.user = user
            next()
        } catch (error) {
            return res.status(200).json({
                message: error.message,
                success: false,
            })
        }
    } else {
        return res.status(200).json({
            message: 'Unauthorized',
            success: false,
        })
    }
}

const isAdmin = async (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next()
    } else {
        return res.status(200).json({
            message: 'Unauthorized',
            success: false,
        })
    }
}

export default {
    Protected,
    isAdmin,
}
