//importing controllers
const { signup, login, upgrade_to_premium, update_tsc_status, check_premium, get_leaderboard, forgot_password, reset_password, reset_new_password } = require("../controllers/user_controller")

//importing middlewares
const { verify_user } = require('../middlewares/user_auth')

module.exports = function(app){
    app.post('/user/signup',verify_user,signup),
    app.post('/user/login',login),
    app.get('/user/purchase-premium',upgrade_to_premium),
    app.post('/user/update-transaction-status',update_tsc_status),
    app.get('/user/check-premium',check_premium),
    app.get('/premium/leaderboard',get_leaderboard),
    app.post('/password/forgot-password',forgot_password),
    app.get('/password/reset-password/:uuid',reset_password),
    app.post('/password/reset-new-password',reset_new_password)
}