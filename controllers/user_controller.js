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

module.exports={signup}