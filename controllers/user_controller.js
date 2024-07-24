const bcrypt = require('bcrypt')
const { generate_jwt_token } = require('../util/jwt')

let { signup_service, login_service, forgot_password_service,
    reset_password_service, reset_new_password_service } = require('../services/user_services')

async function signup(req,res){
    req.body.password = bcrypt.hashSync(req.body.password,8)
    
    let response = await signup_service(req.body)
    if(response.error){
        res.status(500).send(JSON.stringify(response.error))
    }else{
        res.status(201).send(JSON.stringify(response.message))
    }
}

async function login(req,res){
    let db_res = await login_service(req.body)
    if(db_res.error){
        res.status(500).send(JSON.stringify(db_res.error))
    }else{
        if(db_res){
            //user found
            if(bcrypt.compareSync(req.body.password, db_res.dataValues.password)){
                //checking password
                let token = generate_jwt_token(db_res.dataValues.id)
                res.status(200).send(JSON.stringify({message: "Logged In Successfullly",token:token}))
            }else{
                res.status(401).send(JSON.stringify({error: "Bad Credentials"}))
            }
        }else{
            res.status(404).send(JSON.stringify({error: "User Not Found"}))
        }
    }
}

async function forgot_password(req,res){
    let response = await forgot_password_service(req.body.email)
    if(response.error){
        res.status(500).send(response)
    }else{
        res.status(200).send(response)
    }
}

async function reset_password(req,res){
    let uuid = req.params.uuid
    let response = await reset_password_service(uuid)
    if(response==null){
        res.status(404).send({error: 'Link Does Not Exist'})
    }
    else if(response.error){
        res.status(500).send(response)
    }else{
        if(response.dataValues.is_active){
            res.redirect(`/reset_password.html?userId=${response.dataValues.userId}`)
        }else{
            res.status(410).send({error: 'Link Expired'})
        }
    }
}

async function reset_new_password(req,res){
    let new_password = bcrypt.hashSync(req.body.new_password,8)
    let userId = req.body.userId
    
    let response = await reset_new_password_service(new_password,userId)
    if(response.error){
        res.status(500).send(response)
    }else{
        res.status(204).send(response)
    }
}

module.exports={
    signup, login,   
    forgot_password, reset_password, reset_new_password
}