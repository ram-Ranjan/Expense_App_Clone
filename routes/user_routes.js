const { signup } = require("../controllers/user_controller")

module.exports = function(app){
    app.post('/user/signup',signup)
}