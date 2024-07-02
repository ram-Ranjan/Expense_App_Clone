//importing controllers
const { signup } = require("../controllers/user_controller")

//importing middlewares
const { verify_user } = require('../middlewares/user_auth')

module.exports = function(app){
    app.post('/user/signup',verify_user,signup)
}