let express = require('express')
const cors = require('cors')
const sequelize = require('./util/database')

let app = express()

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    console.log("hello")
    res.send("Hello World")
})

require('./routes/user_routes')(app)
require('./routes/expense_routes')(app)

sequelize.sync()
.then(result => {
    app.listen(3000)
    console.log("Synced with DB and app runing on port: ",3000)
}).catch(err => console.log(err))