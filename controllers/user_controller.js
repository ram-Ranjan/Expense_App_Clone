const user_model = require('../models/user_model')
const bcrypt = require('bcrypt')
const { generate_jwt_token } = require('../util/jwt')

function signup(req,res){
    req.body.password = bcrypt.hashSync(req.body.password,8)
    user_model.create(req.body)
    .then(db_res=>{
        res.status(201).send(JSON.stringify({message:"User Registered Successfully"}))
    }).catch(err=>{
        console.log(err)
        res.status(500).send(JSON.stringify({error:err}))
    })
}

function login(req,res){
    user_model.findOne({where:{
        email: req.body.email
    }}).then(db_res=>{
        //user found
        if(db_res){
            //checking password
            if(bcrypt.compareSync(req.body.password, db_res.dataValues.password)){
                let token = generate_jwt_token(db_res.dataValues.id)
                res.status(200).send(JSON.stringify({message: "Logged In Successfullly",token:token}))
            }else{
                res.status(401).send(JSON.stringify({error: "Bad Credentials"}))
            }
        }else{
            res.status(404).send(JSON.stringify({error: "User Not Found"}))
        }
    })
}
module.exports={signup, login}