const jwt = require('jsonwebtoken')

function generate_jwt_token(payload){
    let token=jwt.sign(payload,'SECRET')
    return token
}

function verify_jwt_token(token){
    let decoded_id = jwt.verify(token,'SECRET')
    return decoded_id
}

module.exports = {generate_jwt_token, verify_jwt_token}