/* eslint-disable */
import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.DB_HOST, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })

        console.log(`Connected : MongoDb connected with ${db.connection.host}`)
    } catch (error) {
        console.error(
            `ERROR : Not able to connect database due to ${error.message}`
        )
        process.exit(1)
    }
}
