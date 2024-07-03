const user_model = require('../models/user_model')
const order_model = require('../models/order_model')
const bcrypt = require('bcrypt')
const { generate_jwt_token,verify_jwt_token } = require('../util/jwt')
const Razorpay = require('razorpay')
require('dotenv').config()

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

function upgrade_to_premium(req,res){
    let userId = verify_jwt_token(req.headers.authorization)
    let razor = new Razorpay({
        key_id: process.env.key_id,
        key_secret: process.env.key_secret
    })
    const amount = 199

    razor.orders.create({amount,currency: "INR"}, (err, order)=>{
        if(err){
            res.status(500).send(JSON.stringify({error: err}))
        }
        order_model.create({
            order_id: order.id,
            status: "PENDING"
        }).then(db_res=>{
            res.status(201).send(JSON.stringify({order, key_id: razor.key_id}))
        }).catch(err=>{
            console.log(err)
            res.status(500).send(JSON.stringify({error: err}))
        })
    })
    //res.status(200).send({message: "Upgraded To Premium Successfully"})
}

function update_tsc_status(req,res){
    console.log(req.body)
    res.status(200).send(JSON.stringify({message:"Success"}))
}

module.exports={signup, login, upgrade_to_premium, update_tsc_status}