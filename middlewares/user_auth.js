const user_model = require('../models/user_model')

function verify_user(req,res,next){
    let user_details = req.body

    //checking with db if the user exists
    user_model.findAll({where:{
        username: user_details.username
    }}).then(db_res=>{
        if(db_res.length==0){
            next()
        }else{
            res.status(403).send(JSON.stringify({message:"User Already exists"}))
        }
    }).catch(err=>{
        console.log(err)
        res.status(500).send(JSON.stringify({error:err}))
    })
}

module.exports = {verify_user}