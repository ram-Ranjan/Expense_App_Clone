const user_model = require('../models/user_model')

function signup(req,res){
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
            if(req.body.password==db_res.dataValues.password){
                res.status(200).send(JSON.stringify({message: "Logged In Successfullly"}))
            }else{
                res.status(401).send(JSON.stringify({error: "Bad Credentials"}))
            }
        }else{
            res.status(404).send(JSON.stringify({error: "User Not Found"}))
        }
    })
}
module.exports={signup, login}