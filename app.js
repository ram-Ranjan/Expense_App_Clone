let express = require('express')
const cors = require('cors')

let app = express()

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    console.log("hello")
    res.send("Hello World")
})

require('./routes/user_routes')(app)

app.listen(3000,()=>{
    console.log("app running on 3000")
})