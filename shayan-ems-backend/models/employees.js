import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const employeeSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  father_name: {
    type: String,
    required: true,
  },
  personal_email: {
    type: String,
    required: true,
    unique: true,
  },
  official_email: {
    type: String,
    required: true,
  },
  mobile_number: {
    type: String,
    required: true,
  },
  residential_number: {
    type: String,
    required: true,
  },
  national_id_number: {
    type: String,
    required: true,
    unique: true,
  },
  account_No: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: String,
    required: true,
  },
  residential_address: {
    type: String,
    required: true,
  },
  permanent_address: {
    type: String,
    required: true,
  },
  joining_date: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  medical_allowance: {
    type: Number,
    default: 0,
  },
  contract_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contracts",
    required: true,
  },
  machine_no: {
    type: Number,
  },
  contract: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
  },
  updated_at: {
    type: Date,
  },
  deleted_at: {
    type: Date,
  },
  isSoftDeleted: {
    type: Boolean,
  },
  job_title: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  yearly_quota: {
    type: Number,
  },
});

employeeSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

employeeSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET)
}

employeeSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    if (this.password) {
        let salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
})

var employees = mongoose.model('employees', employeeSchema)
export default employees
