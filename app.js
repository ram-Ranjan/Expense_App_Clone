let express = require('express')
let helmet = require('helmet')
let morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const sequelize = require('./util/database')
const user_model = require('./models/user_model')
const expense_model = require('./models/expense_model')
const order_model = require('./models/order_model')
const forgot_password_req_model = require('./models/forgot_password_req_model')
require('dotenv').config

let app = express()

app.use(cors())
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://cdnjs.cloudflare.com",
                "https://checkout.razorpay.com",
                "https://api.razorpay.com",
                "https://cdn.jsdelivr.net"
            ],
            frameSrc: [
                "'self'", 
                "https://checkout.razorpay.com", 
                "https://api.razorpay.com"
            ],
            connectSrc: [
                "'self'",
                "https://api.razorpay.com"
            ],
        }
    }
}))
app.use(morgan('combined'))
app.use(express.json())
app.use(express.static('views/user_views'))

app.get('/',(req,res)=>{
    console.log("hello")
    res.send("Hello World")
})

require('./routes/user_routes')(app)
require('./routes/expense_routes')(app)

app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`views/${req.url}`))
})

user_model.hasMany(expense_model)
expense_model.belongsTo(user_model)

user_model.hasMany(order_model)
order_model.belongsTo(user_model)

user_model.hasMany(forgot_password_req_model)
forgot_password_req_model.belongsTo(user_model)

let PORT = process.env.PORT || 3000

sequelize.sync()
.then(result => {
    app.listen(PORT)
    console.log("Synced with DB and app runing on port: ",PORT)
}).catch(err => console.log(err))