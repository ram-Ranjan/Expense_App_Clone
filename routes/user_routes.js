//importing controllers
const { signup,login,upgrade_to_premium,update_tsc_status } = require("../controllers/user_controller")

//importing middlewares
const { verify_user } = require('../middlewares/user_auth')

module.exports = function(app){
    app.post('/user/signup',verify_user,signup),
    app.post('/user/login',login),
    app.get('/user/purchase-premium',upgrade_to_premium),
    app.post('/user/update-transaction-status',update_tsc_status)
}