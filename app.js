let express = require('express')
const cors = require('cors')
const sequelize = require('./util/database')
const user_model = require('./models/user_model')
const expense_model = require('./models/expense_model')

let app = express()

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    console.log("hello")
    res.send("Hello World")
})

require('./routes/user_routes')(app)
require('./routes/expense_routes')(app)

user_model.hasMany(expense_model)
expense_model.belongsTo(user_model)

sequelize.sync()
.then(result => {
    app.listen(3000)
    console.log("Synced with DB and app runing on port: ",3000)
}).catch(err => console.log(err))