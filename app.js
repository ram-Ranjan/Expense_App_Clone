let express = require('express')
const cors = require('cors')
const sequelize = require('./util/database')
const user_model = require('./models/user_model')
const expense_model = require('./models/expense_model')
const order_model = require('./models/order_model')
const forgot_password_req_model = require('./models/forgot_password_req_model')

let app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('views/user_views'))

app.get('/',(req,res)=>{
    console.log("hello")
    res.send("Hello World")
})

require('./routes/user_routes')(app)
require('./routes/expense_routes')(app)

user_model.hasMany(expense_model)
expense_model.belongsTo(user_model)

user_model.hasMany(order_model)
order_model.belongsTo(user_model)

user_model.hasMany(forgot_password_req_model)
forgot_password_req_model.belongsTo(user_model)

sequelize.sync()
.then(result => {
    app.listen(3000)
    console.log("Synced with DB and app runing on port: ",3000)
}).catch(err => console.log(err))