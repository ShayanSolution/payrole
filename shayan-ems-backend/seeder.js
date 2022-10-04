import seeder from 'mongoose-seed'
import employeeData from './data/employees.json'

const db = 'mongodb://localhost:27017/ems-sha'

seeder.connect(
    db,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
    },
    function () {
        seeder.loadModels(['./models/employees'])

        seeder.clearModels(['employees'], function () {
            seeder.populateModels(employeeData, function () {
                seeder.disconnect()
            })
        })
    }
)
